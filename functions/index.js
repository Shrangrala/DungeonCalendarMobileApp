const admin = require('firebase-admin');
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions');

admin.initializeApp();

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

function arrayify(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function chosenDate(campaign = {}) {
  return campaign.chosenDate || campaign.finalDate || campaign.sessionDate || campaign.selectedDate || campaign.nextSessionDate || '';
}

function participantIds(campaign = {}) {
  return Array.from(new Set([
    campaign.ownerId,
    ...(arrayify(campaign.dungeonMasterIds)),
    ...(arrayify(campaign.memberIds)),
    ...(arrayify(campaign.playerIds)),
  ].filter(Boolean)));
}

async function readUserPushTokens(userIds = []) {
  const refs = userIds.map((uid) => admin.firestore().doc(`users/${uid}`));
  const snaps = await admin.firestore().getAll(...refs);
  const tokens = [];
  snaps.forEach((snap) => {
    if (!snap.exists) return;
    const user = snap.data() || {};
    const settings = user.notificationSettings || {};
    if (settings.enabled === false) return;
    tokens.push(...arrayify(user.expoPushTokens));
    if (user.expoPushToken) tokens.push(user.expoPushToken);
  });
  return Array.from(new Set(tokens)).filter((token) => String(token).startsWith('ExponentPushToken['));
}

async function sendExpoPush(tokens, title, body, data = {}) {
  if (!tokens.length) return;
  const messages = tokens.map((to) => ({ to, title, body, data, sound: 'default', priority: 'high' }));
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chunk),
    });
    if (!response.ok) logger.warn('Expo push request failed', { status: response.status, text: await response.text() });
  }
}

exports.notifyCampaignChange = onDocumentWritten('campaigns/{campaignId}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  if (!after) return;

  const beforeChosen = chosenDate(before || {});
  const afterChosen = chosenDate(after || {});
  const beforeAvailability = JSON.stringify((before || {}).availability || {});
  const afterAvailability = JSON.stringify(after.availability || {});
  const beforeManual = JSON.stringify((before || {}).manuallySelectedDates || []);
  const afterManual = JSON.stringify(after.manuallySelectedDates || []);

  let title = '';
  let body = '';
  if (beforeChosen !== afterChosen && afterChosen) {
    title = 'Session date chosen';
    body = `${after.name || 'A campaign'} is scheduled for ${afterChosen}.`;
  } else if (beforeManual !== afterManual) {
    title = 'Proposed dates updated';
    body = `${after.name || 'A campaign'} has updated proposed session dates.`;
  } else if (beforeAvailability !== afterAvailability) {
    title = 'Availability updated';
    body = `A player updated availability for ${after.name || 'your campaign'}.`;
  } else {
    return;
  }

  const tokens = await readUserPushTokens(participantIds(after));
  await sendExpoPush(tokens, title, body, { campaignId: event.params.campaignId, route: 'campaignDetail' });
});
