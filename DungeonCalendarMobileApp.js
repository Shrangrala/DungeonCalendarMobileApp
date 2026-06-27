import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const COLORS = {
  bg: "#050505",
  panel: "rgba(14, 14, 14, 0.98)",
  panel2: "rgba(22, 22, 22, 0.98)",
  border: "#2a2a2a",
  red: "#dc2626",
  redDark: "#991b1b",
  gold: "#f4c76a",
  white: "#f8fafc",
  muted: "#a1a1aa",
  green: "#22c55e",
  blue: "#60a5fa",
  amber: "#f59e0b",
};

const isDungeonMaster = true;

const campaigns = [
  { id: "curse", name: "Curse of Strahd", level: "Level 7", next: "May 24, 2025", dm: "You", status: "Active", color: "#3b0764" },
  { id: "storm", name: "Storm King’s Thunder", level: "Level 5", next: "May 31, 2025", dm: "You", status: "Active", color: "#0f2741" },
  { id: "waterdeep", name: "Waterdeep: Dragon Heist", level: "Level 3", next: "Jun 7, 2025", dm: "You", status: "Active", color: "#431407" },
  { id: "lost", name: "Lost Mines of Phandelver", level: "Level 2", next: "Jun 14, 2025", dm: "You", status: "Active", color: "#14532d" },
];

const proposedDates = [
  { key: "may24", month: "MAY", day: "24", weekday: "SAT", label: "May 24", available: 5, unavailable: 1, status: "selected" },
  { key: "may31", month: "MAY", day: "31", weekday: "SAT", label: "May 31", available: 4, unavailable: 2, status: "proposed" },
  { key: "jun07", month: "JUN", day: "07", weekday: "SAT", label: "Jun 7", available: 3, unavailable: 3, status: "proposed" },
];

const players = [
  { name: "Alice", role: "Level 7 Paladin", status: "Available", color: COLORS.green },
  { name: "Brandon", role: "Level 7 Ranger", status: "Available", color: COLORS.green },
  { name: "Cody", role: "Level 7 Wizard", status: "Unavailable", color: COLORS.red },
  { name: "Jessica", role: "Level 7 Rogue", status: "Available", color: COLORS.green },
  { name: "DM (You)", role: "Dungeon Master", status: "Available", color: COLORS.green },
];

const planCards = [
  {
    id: "free",
    name: "Free Plan",
    price: "$0",
    tagline: "For getting started",
    features: ["Create and manage your first campaign", "Basic scheduling and player availability", "Core calendar tools"],
    active: false,
  },
  {
    id: "adventurer",
    name: "Adventurer Plan",
    price: "$4.99/mo",
    tagline: "For active groups",
    features: ["More campaigns and sessions", "Expanded scheduling tools", "Better reminders and campaign organization"],
    active: false,
  },
  {
    id: "guildmaster",
    name: "Guildmaster Plan",
    price: "$9.99/mo",
    tagline: "For Dungeon Masters running multiple groups",
    features: ["Full campaign scheduling tools", "Advanced availability and auto-pick support", "Best for multiple campaigns and larger groups"],
    active: true,
  },
];

function Icon({ children, color = COLORS.red }) {
  return <Text style={[styles.icon, { color }]}>{children}</Text>;
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Header({ title, subtitle, onSettings }) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image source={require("./assets/dungeon-calendar-logo.png")} style={styles.logo} resizeMode="contain" />
        <View style={styles.brandCopy}>
          <Text style={styles.brandGold}>Dungeon</Text>
          <Text style={styles.brandGold}>Calendar</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.cogButton} onPress={onSettings} activeOpacity={0.84}>
        <Text style={styles.cogText}>⚙</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function Screen({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <SafeAreaView style={styles.loginScreen}>
      <Image source={require("./assets/dungeon-calendar-logo.png")} style={styles.loginLogo} resizeMode="contain" />
      <Text style={styles.loginTitle}>Dungeon Calendar</Text>
      <Text style={styles.loginSubtitle}>Plan. Play. Remember.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
        <Text style={styles.primaryButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onLogin}>
        <Text style={styles.secondaryButtonText}>Continue with Email</Text>
      </TouchableOpacity>
      <Text style={styles.legalText}>By continuing, you agree to our Terms of Service and Privacy Policy.</Text>
    </SafeAreaView>
  );
}

function CampaignSelector() {
  return (
    <TouchableOpacity style={styles.selector} activeOpacity={0.85}>
      <Text style={styles.selectorIcon}>⚜</Text>
      <Text style={styles.selectorText}>Curse of Strahd</Text>
      <Text style={styles.selectorPlan}>Guildmaster</Text>
      <Text style={styles.selectorChevron}>⌄</Text>
    </TouchableOpacity>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <View style={styles.statCard}>
      <Icon color={color}>{icon}</Icon>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function StatGrid({ children }) {
  return <View style={styles.statsGrid}>{children}</View>;
}

function DateBadge({ month, day, weekday }) {
  return (
    <View style={styles.dateBadge}>
      <Text style={styles.dateMonth}>{month}</Text>
      <Text style={styles.dateDay}>{day}</Text>
      <Text style={styles.dateWeekday}>{weekday}</Text>
    </View>
  );
}

function Dashboard({ navigate, openSettings }) {
  return (
    <Screen>
      <Header title="Welcome back," subtitle="DM (You)" onSettings={openSettings} />
      <CampaignSelector />

      <StatGrid>
        <StatCard icon="▣" label="Campaigns" value="12" color={COLORS.red} />
        <StatCard icon="♟" label="Players" value="5" color={COLORS.green} />
        <StatCard icon="▥" label="Proposed Dates" value="3" color={COLORS.blue} />
        <StatCard icon="◇" label="Plan" value="Guildmaster" color={COLORS.gold} />
      </StatGrid>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.inlineTitle}>
            <Icon>▣</Icon>
            <Text style={styles.sectionTitle}>Upcoming Session</Text>
          </View>
          <TouchableOpacity style={styles.outlineButton} onPress={() => navigate("results")}>
            <Text style={styles.outlineButtonText}>Auto Pick Best Date</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sessionRow} onPress={() => navigate("session")} activeOpacity={0.85}>
          <DateBadge month="MAY" day="24" weekday="SAT" />
          <View style={styles.sessionArt} />
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>Storm King’s Thunder</Text>
            <Text style={styles.sessionText}>Best date from player availability</Text>
            <Text style={styles.sessionAccent}>5 available · 1 unavailable</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigate("session")}>
          <Text style={styles.primaryButtonText}>Open Session</Text>
        </TouchableOpacity>
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Calendar Overview</Text>
          <TouchableOpacity style={styles.outlineButton} onPress={() => navigate("calendar")}>
            <Text style={styles.outlineButtonText}>Open Calendar</Text>
          </TouchableOpacity>
        </View>
        <MiniCalendar compact />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <QuickAction icon="▣" label="Propose Dates" detail="DM only" onPress={() => navigate("calendar")} />
          <QuickAction icon="▥" label="View Results" detail="Compare dates" onPress={() => navigate("results")} />
          <QuickAction icon="⚙" label="Plan Settings" detail="Subscription" onPress={() => navigate("plan")} />
        </View>
      </Card>
    </Screen>
  );
}

function QuickAction({ icon, label, detail, onPress }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.85}>
      <Icon>{icon}</Icon>
      <Text style={styles.quickLabel}>{label}</Text>
      <Text style={styles.quickDetail}>{detail}</Text>
    </TouchableOpacity>
  );
}

function MiniCalendar({ compact = false }) {
  const names = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const nums = ["27", "28", "29", "30", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
  return (
    <View>
      <Text style={styles.calendarTitle}>May 2025</Text>
      <View style={styles.calendarGrid}>
        {names.map((n) => <Text key={n} style={styles.dayName}>{n}</Text>)}
        {nums.map((n, i) => {
          const proposed = (n === "24" && i > 20) || (n === "31" && i > 20) || n === "7";
          const selected = n === "24" && i > 20;
          return (
            <View key={`${n}-${i}`} style={[styles.dayCell, compact ? styles.dayCellCompact : null, selected ? styles.selectedDay : proposed ? styles.proposedDay : null]}>
              <Text style={[styles.dayNum, compact ? styles.dayNumCompact : null, selected ? styles.activeDayText : null]}>{n}</Text>
              {proposed ? <View style={[styles.eventDot, selected ? styles.goldDot : null]} /> : null}
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.blue }]} /><Text style={styles.legendText}>DM proposed</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.gold }]} /><Text style={styles.legendText}>Best date</Text></View>
      </View>
    </View>
  );
}

function CalendarScreen({ navigate, openSettings }) {
  return (
    <Screen>
      <Header title="Calendar" subtitle={isDungeonMaster ? "DM proposes dates; players vote availability" : "Choose your availability"} onSettings={openSettings} />
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.calendarTitle}>May 2025</Text>
          {isDungeonMaster ? (
            <TouchableOpacity style={styles.smallRedButton} onPress={() => Alert.alert("Propose Date", "This will open the date proposal editor.")}>
              <Text style={styles.smallRedButtonText}>+ Propose Date</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <MiniCalendar />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>{isDungeonMaster ? "DM Proposed Session Dates" : "Your Availability"}</Text>
        <Text style={styles.helperText}>
          {isDungeonMaster
            ? "Only the DM can add or remove proposed session dates. Players can mark each proposed date as available or unavailable."
            : "Players can only respond to dates proposed by the DM."}
        </Text>
        {proposedDates.map((d) => (
          <AvailabilityDateRow key={d.key} date={d} navigate={navigate} />
        ))}
      </Card>
    </Screen>
  );
}

function AvailabilityDateRow({ date, navigate }) {
  return (
    <TouchableOpacity style={styles.availabilityRow} onPress={() => navigate("results")} activeOpacity={0.86}>
      <DateBadge month={date.month} day={date.day} weekday={date.weekday} />
      <View style={styles.eventInfo}>
        <Text style={styles.sessionTitle}>{date.label}, 2025</Text>
        <Text style={styles.sessionText}>{date.available} available · {date.unavailable} unavailable</Text>
        <View style={styles.responseButtons}>
          {isDungeonMaster ? (
            <>
              <TouchableOpacity style={[styles.voteButton, date.status === "selected" ? styles.voteSelected : null]} onPress={() => Alert.alert("Chosen Date", `${date.label} selected.`)}>
                <Text style={styles.voteButtonText}>{date.status === "selected" ? "Chosen Date" : "Set as Chosen"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.voteButtonMuted} onPress={() => Alert.alert("Remove Date", `Remove ${date.label}?`)}>
                <Text style={styles.voteMutedText}>Remove</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.voteAvailable}><Text style={styles.voteButtonText}>Available</Text></TouchableOpacity>
              <TouchableOpacity style={styles.voteUnavailable}><Text style={styles.voteButtonText}>Unavailable</Text></TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function Campaigns({ navigate, openSettings }) {
  return (
    <Screen>
      <Header title="Campaigns" subtitle="Manage your adventures" onSettings={openSettings} />
      <View style={styles.searchRow}>
        <Text style={styles.searchText}>⌕  Search campaigns...</Text>
        <TouchableOpacity style={styles.smallRedButton} onPress={() => Alert.alert("Add Campaign", "Campaign creation editor opens here.")}>
          <Text style={styles.smallRedButtonText}>+ Add Campaign</Text>
        </TouchableOpacity>
      </View>
      {campaigns.map((c) => (
        <TouchableOpacity key={c.id} activeOpacity={0.86} onPress={() => navigate("campaignDetail")}>
          <Card style={styles.campaignCard}>
            <View style={[styles.campaignArt, { backgroundColor: c.color }]} />
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignTitle}>{c.name}</Text>
              <Text style={styles.sessionText}>{c.level}</Text>
              <Text style={styles.sessionText}>Next Session: {c.next}</Text>
              <Text style={styles.sessionText}>DM: {c.dm}</Text>
            </View>
            <View style={styles.badge}><Text style={styles.badgeText}>{c.status}</Text></View>
            <Text style={styles.chevron}>›</Text>
          </Card>
        </TouchableOpacity>
      ))}
    </Screen>
  );
}

function CampaignDetail({ openSettings }) {
  return (
    <Screen>
      <Header title="Campaign Details" subtitle="Curse of Strahd" onSettings={openSettings} />
      <Card>
        <View style={styles.detailsHero} />
        <SettingsRow label="Campaign Name" detail="Curse of Strahd" onPress={() => Alert.alert("Edit", "Campaign name editor opens here.")} />
        <SettingsRow label="Campaign Level" detail="Level 7" onPress={() => Alert.alert("Edit", "Campaign level editor opens here.")} />
        <SettingsRow label="Dungeon Master" detail="DM (You)" onPress={() => Alert.alert("Edit", "DM settings open here.")} />
        <SettingsRow label="Campaign Image" detail="Edit image" onPress={() => Alert.alert("Edit", "Image picker opens here.")} />
        <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert("Saved", "Campaign changes saved.")}>
          <Text style={styles.primaryButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

function Players({ openSettings }) {
  return (
    <Screen>
      <Header title="Players" subtitle="Manage players and availability" onSettings={openSettings} />
      <StatGrid>
        <StatCard icon="♟" label="Total" value="5" color={COLORS.green} />
        <StatCard icon="▣" label="Available" value="4" color={COLORS.blue} />
        <StatCard icon="◷" label="Unavailable" value="1" color={COLORS.red} />
        <StatCard icon="◇" label="Pending" value="0" color={COLORS.gold} />
      </StatGrid>
      <Text style={styles.searchText}>⌕  Search players...</Text>
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Player List</Text>
          <TouchableOpacity style={styles.outlineButton} onPress={() => Alert.alert("Add Player", "Invite/add player form opens here.")}>
            <Text style={styles.outlineButtonText}>+ Add Player</Text>
          </TouchableOpacity>
        </View>
        {players.map((p) => (
          <TouchableOpacity key={p.name} style={styles.playerRow} onPress={() => Alert.alert(p.name, "Player editor opens here.")}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{p.name[0]}</Text></View>
            <View style={styles.playerInfo}>
              <Text style={styles.campaignTitle}>{p.name}</Text>
              <Text style={styles.sessionText}>{p.role}</Text>
              <Text style={[styles.sessionAccent, { color: p.color }]}>{p.status}</Text>
            </View>
            <Text style={styles.moreDots}>•••</Text>
          </TouchableOpacity>
        ))}
      </Card>
      <Card style={styles.quickAvailability}>
        <View>
          <Text style={styles.sectionTitle}>Quick Availability</Text>
          <Text style={styles.sessionText}>Update your proposed-date responses</Text>
        </View>
        <TouchableOpacity style={styles.primaryButtonSmall} onPress={() => Alert.alert("Availability", "Availability editor opens here.")}>
          <Text style={styles.primaryButtonText}>Update</Text>
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

function Results({ openSettings }) {
  return (
    <Screen>
      <Header title="Results" subtitle="Compare proposed session dates" onSettings={openSettings} />
      <Card>
        <Text style={styles.sectionTitle}>Availability Results</Text>
        {proposedDates.map((d) => (
          <View key={d.key} style={styles.resultRow}>
            <Icon>▥</Icon>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{d.label}, 2025</Text>
              <Text style={styles.resultMeta}>{d.available} available · {d.unavailable} unavailable</Text>
            </View>
            <View style={styles.resultTotal}><Text style={styles.resultTotalText}>{d.status === "selected" ? "Best" : "View"}</Text></View>
          </View>
        ))}
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Auto Pick Best Date</Text>
        <Text style={styles.helperText}>The best date is chosen from DM-proposed dates using player availability responses.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert("Best Date", "May 24 is currently the best proposed date.")}>
          <Text style={styles.primaryButtonText}>Pick May 24</Text>
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

function SessionDetails({ openSettings }) {
  return (
    <Screen>
      <Header title="Session Details" subtitle="Storm King’s Thunder" onSettings={openSettings} />
      <Card>
        <View style={styles.detailsHero} />
        <Text style={styles.detailsTitle}>Storm King’s Thunder</Text>
        <Text style={styles.sessionText}>Chosen from DM-proposed availability dates</Text>
        <InfoLine icon="▣" text="Saturday, May 24, 2025" />
        <InfoLine icon="◷" text="6:00 PM – 10:00 PM" />
        <InfoLine icon="♟" text="5 available · 1 unavailable" />
        <InfoLine icon="⌖" text="Tom’s House" />
        <Text style={styles.listHeading}>Notes</Text>
        <Text style={styles.notesText}>This date was selected from the proposed session dates after players marked availability.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert("RSVP", "You are marked as going.")}>
          <Text style={styles.primaryButtonText}>I’m Going</Text>
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

function InfoLine({ icon, text }) {
  return <View style={styles.infoLine}><Icon color={COLORS.gold}>{icon}</Icon><Text style={styles.infoText}>{text}</Text></View>;
}

function UserSettings({ navigate, openSettings, openDeleteAccount, handleLogout }) {
  return (
    <Screen>
      <Header title="User Settings" subtitle="Account and app settings" onSettings={openSettings} />
      <Card>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingsRow label="Profile Information" detail="Name, email, avatar" onPress={() => navigate("profile")} />
        <SettingsRow label="Notifications" detail="Session reminders and invite updates" onPress={() => navigate("notifications")} />
        <SettingsRow label="Campaign Settings" detail="Default campaign and session settings" onPress={() => navigate("campaignSettings")} />
        <SettingsRow label="Plan Settings" detail="Guildmaster Plan" onPress={() => navigate("plan")} />
        <SettingsRow label="Privacy Policy" detail="View privacy information" onPress={() => navigate("privacy")} />
        <SettingsRow label="Terms of Service" detail="View terms" onPress={() => navigate("terms")} />
        <SettingsRow label="About Dungeon Calendar" detail="Version 1.0.15" onPress={() => navigate("about")} />
      </Card>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}><Text style={styles.logoutText}>Log Out</Text></TouchableOpacity>
      <TouchableOpacity style={styles.deleteAccountButton} onPress={openDeleteAccount}><Text style={styles.deleteAccountText}>Delete Account</Text></TouchableOpacity>
    </Screen>
  );
}

function ProfileScreen({ openSettings }) {
  return (
    <Screen>
      <Header title="Profile" subtitle="Profile Information" onSettings={openSettings} />
      <Card>
        <Image source={require("./assets/dungeon-calendar-logo.png")} style={styles.profileLogo} resizeMode="contain" />
        <SettingsRow label="Display Name" detail="DM (You)" onPress={() => Alert.alert("Edit", "Display name editor opens here.")} />
        <SettingsRow label="Email" detail="dm@example.com" onPress={() => Alert.alert("Email", "Email settings open here.")} />
        <SettingsRow label="Role" detail="Dungeon Master" onPress={() => Alert.alert("Role", "Role settings open here.")} />
      </Card>
    </Screen>
  );
}

function CampaignSettings({ openSettings }) {
  return (
    <Screen>
      <Header title="Campaign Settings" subtitle="Default settings" onSettings={openSettings} />
      <Card>
        <SettingsRow label="Default Campaign" detail="Curse of Strahd" onPress={() => Alert.alert("Default Campaign", "Selector opens here.")} />
        <SettingsRow label="Default Session Duration" detail="4 hours" onPress={() => Alert.alert("Duration", "Duration editor opens here.")} />
        <SettingsRow label="Default Location" detail="Tom’s House" onPress={() => Alert.alert("Location", "Location editor opens here.")} />
        <SettingsRow label="Automatically Suggest Dates" detail="On" onPress={() => Alert.alert("Auto Suggest", "Toggle saved.")} />
      </Card>
    </Screen>
  );
}

function Notifications({ openSettings }) {
  return (
    <Screen>
      <Header title="Notifications" subtitle="Reminder settings" onSettings={openSettings} />
      <Card>
        <SettingsRow label="Enable Notifications" detail="On" onPress={() => Alert.alert("Notifications", "Toggle saved.")} />
        <SettingsRow label="Session Reminders" detail="1 day before" onPress={() => Alert.alert("Reminders", "Reminder editor opens here.")} />
        <SettingsRow label="Player Availability Changes" detail="On" onPress={() => Alert.alert("Availability", "Toggle saved.")} />
        <SettingsRow label="Proposed Dates Updates" detail="On" onPress={() => Alert.alert("Proposed Dates", "Toggle saved.")} />
      </Card>
    </Screen>
  );
}

function PlanSettings({ openSettings }) {
  return (
    <Screen>
      <Header title="Plan Settings" subtitle="Free, Adventurer, and Guildmaster plans" onSettings={openSettings} />
      <Card>
        <Text style={styles.sectionTitle}>Current Plan</Text>
        <Text style={styles.planTitle}>Guildmaster Plan</Text>
        <Text style={styles.helperText}>Mobile uses the same Firebase account and subscription status as the main web app.</Text>
      </Card>

      {planCards.map((plan) => (
        <Card key={plan.id} style={plan.active ? styles.activePlanCard : null}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.campaignTitle}>{plan.name}</Text>
              <Text style={styles.sessionText}>{plan.tagline}</Text>
            </View>
            <Text style={styles.planPrice}>{plan.price}</Text>
          </View>

          {plan.features.map((feature) => (
            <View key={feature} style={styles.planFeatureRow}>
              <Text style={styles.planCheck}>✓</Text>
              <Text style={styles.planFeatureText}>{feature}</Text>
            </View>
          ))}

          <TouchableOpacity style={plan.active ? styles.activePlanButton : styles.outlineWideButton} onPress={() => Alert.alert(plan.name, plan.active ? "This is your current plan." : "Plan selection opens here.")}>
            <Text style={plan.active ? styles.activePlanText : styles.outlineButtonText}>
              {plan.active ? "Current Plan" : `Choose ${plan.name}`}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}
    </Screen>
  );
}

function SimpleInfoPage({ title, children, openSettings }) {
  return (
    <Screen>
      <Header title={title} onSettings={openSettings} />
      <Card>
        {children}
      </Card>
    </Screen>
  );
}

function AboutPage({ openSettings }) {
  return (
    <Screen>
      <Header title="About" subtitle="Dungeon Calendar" onSettings={openSettings} />
      <Card style={styles.aboutCard}>
        <Image source={require("./assets/dungeon-calendar-logo.png")} style={styles.aboutLogo} resizeMode="contain" />
        <Text style={styles.aboutTitle}>Dungeon Calendar</Text>
        <Text style={styles.sessionText}>Version 1.0.15</Text>
        <Text style={styles.notesText}>The ultimate tool for managing your D&D campaigns.</Text>
        <Text style={styles.notesText}>© 2025 Dungeon Calendar. All rights reserved.</Text>
      </Card>
    </Screen>
  );
}

function SettingsRow({ label, detail, onPress }) {
  return (
    <TouchableOpacity style={styles.settingsRow} activeOpacity={0.8} onPress={onPress || (() => Alert.alert(label, "Editor opens here."))}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.menuItemText}>{label}</Text>
        <Text style={styles.resultMeta}>{detail}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function SettingsModal({ visible, onClose, navigate, openDeleteAccount, handleLogout }) {
  const settings = [
    ["User Settings", "settings"],
    ["Campaign Settings", "campaignSettings"],
    ["Plan Settings", "plan"],
    ["Notifications", "notifications"],
    ["Privacy Policy", "privacy"],
    ["Terms of Service", "terms"],
    ["About Dungeon Calendar", "about"],
  ];
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.closeText}>×</Text></TouchableOpacity>
          </View>

          <Card>
            <Text style={styles.menuGroup}>Recent Results</Text>
            {proposedDates.map((d) => (
              <View key={d.key} style={styles.resultRow}>
                <Icon>▥</Icon>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{d.label}</Text>
                  <Text style={styles.resultMeta}>{d.available} available · {d.unavailable} unavailable</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); navigate("results"); }}>
              <Text style={styles.menuItemText}>View All Results</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </Card>

          <Card>
            <Text style={styles.menuGroup}>Settings</Text>
            {settings.map(([label, route]) => (
              <TouchableOpacity key={label} style={styles.menuItem} onPress={() => { onClose(); navigate(route); }}>
                <Text style={styles.menuItemText}>{label}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); handleLogout(); }}>
              <Text style={[styles.menuItemText, { color: COLORS.red }]}>Log Out</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); openDeleteAccount(); }}>
              <Text style={[styles.menuItemText, { color: "#f87171" }]}>Delete Account</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

function DeleteAccountModal({ visible, onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === "DELETE";

  const closeAndReset = () => {
    setConfirmText("");
    onClose();
  };

  const confirmDelete = () => {
    if (!canDelete) return;
    Alert.alert("Account deletion requested", "Production deletion should re-authenticate and delete Firebase account/data.");
    closeAndReset();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.confirmBackdrop}>
        <View style={styles.confirmBox}>
          <Text style={styles.confirmIcon}>⚠</Text>
          <Text style={styles.confirmTitle}>Delete Account?</Text>
          <Text style={styles.confirmText}>
            This permanently deletes your Dungeon Calendar account, profile, saved availability, and personal settings.
          </Text>
          <Text style={styles.confirmText}>
            Campaigns you own may need to be transferred or deleted first. This action cannot be undone.
          </Text>

          <Text style={styles.confirmLabel}>Type DELETE to continue</Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            placeholder="DELETE"
            placeholderTextColor="#6b7280"
            style={styles.deleteInput}
          />

          <TouchableOpacity
            style={[styles.deleteConfirmButton, !canDelete ? styles.disabledButton : null]}
            disabled={!canDelete}
            onPress={confirmDelete}
          >
            <Text style={styles.deleteConfirmText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelDeleteButton} onPress={closeAndReset}>
            <Text style={styles.cancelDeleteText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function BottomNav({ route, navigate, openSettings }) {
  const items = [
    ["dashboard", "⌂", "Dashboard"],
    ["calendar", "▣", "Calendar"],
    ["campaigns", "◈", "Campaigns"],
    ["players", "♟", "Players"],
    ["more", "•••", "More"],
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map(([key, icon, label]) => {
        const active = route === key;
        const onPress = key === "more" ? openSettings : () => navigate(key);
        return (
          <TouchableOpacity key={key} style={styles.navItem} onPress={onPress} activeOpacity={0.8}>
            <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
            <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function DungeonCalendarMobileApp() {
  const [route, setRoute] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const navigate = (next) => {
    if (next === "more") {
      setSettingsOpen(true);
      return;
    }
    setRoute(next);
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => { setSettingsOpen(false); setLoggedIn(false); setRoute("dashboard"); } },
    ]);
  };

  const props = {
    navigate,
    openSettings: () => setSettingsOpen(true),
    openDeleteAccount: () => setDeleteAccountOpen(true),
    handleLogout,
  };

  const screen = useMemo(() => {
    switch (route) {
      case "calendar":
        return <CalendarScreen {...props} />;
      case "campaigns":
        return <Campaigns {...props} />;
      case "campaignDetail":
        return <CampaignDetail {...props} />;
      case "players":
        return <Players {...props} />;
      case "results":
        return <Results {...props} />;
      case "settings":
        return <UserSettings {...props} />;
      case "profile":
        return <ProfileScreen {...props} />;
      case "campaignSettings":
        return <CampaignSettings {...props} />;
      case "notifications":
        return <Notifications {...props} />;
      case "privacy":
        return <SimpleInfoPage title="Privacy Policy" openSettings={props.openSettings}><Text style={styles.notesText}>Privacy Policy content opens here and should match the main app.</Text></SimpleInfoPage>;
      case "terms":
        return <SimpleInfoPage title="Terms of Service" openSettings={props.openSettings}><Text style={styles.notesText}>Terms of Service content opens here and should match the main app.</Text></SimpleInfoPage>;
      case "about":
        return <AboutPage {...props} />;
      case "plan":
        return <PlanSettings {...props} />;
      case "session":
        return <SessionDetails {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  }, [route]);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      {screen}
      <BottomNav route={route} navigate={navigate} openSettings={() => setSettingsOpen(true)} />
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        navigate={navigate}
        openDeleteAccount={() => setDeleteAccountOpen(true)}
        handleLogout={handleLogout}
      />
      <DeleteAccountModal visible={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: COLORS.bg },
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 48 : 18,
    paddingBottom: 118,
  },
  loginScreen: { flex: 1, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center", padding: 24 },
  loginLogo: { width: 190, height: 190, marginBottom: 16 },
  loginTitle: { color: COLORS.gold, fontSize: 34, fontWeight: "900", textAlign: "center" },
  loginSubtitle: { color: COLORS.white, fontSize: 18, fontWeight: "800", marginTop: 8, marginBottom: 28 },
  legalText: { color: COLORS.muted, fontSize: 12, textAlign: "center", marginTop: 20, lineHeight: 18 },
  header: { minHeight: 160, marginBottom: 12 },
  brandRow: { flexDirection: "row", alignItems: "center", paddingRight: 68, marginBottom: 12 },
  logo: { width: 88, height: 88, marginRight: 12 },
  brandCopy: { justifyContent: "center", flexShrink: 1 },
  brandGold: { color: COLORS.gold, fontSize: 27, fontWeight: "900", lineHeight: 30 },
  cogButton: {
    position: "absolute",
    right: 0,
    top: Platform.OS === "android" ? 18 : 8,
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10,10,10,0.92)",
  },
  cogText: { color: COLORS.gold, fontSize: 26 },
  pageTitle: { color: COLORS.white, fontSize: 26, fontWeight: "900" },
  pageSubtitle: { color: COLORS.gold, fontSize: 18, fontWeight: "900", marginTop: 6 },
  selector: {
    height: 50,
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  selectorIcon: { color: COLORS.gold, fontSize: 20, marginRight: 10 },
  selectorText: { color: COLORS.white, fontSize: 15, fontWeight: "800", flex: 1 },
  selectorPlan: { color: COLORS.gold, fontSize: 11, marginRight: 10 },
  selectorChevron: { color: COLORS.red, fontSize: 20 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 12 },
  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  statCard: {
    width: "48%",
    minHeight: 100,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  icon: { fontSize: 22, fontWeight: "900" },
  statLabel: { color: COLORS.muted, fontSize: 12, marginTop: 9 },
  statValue: { color: COLORS.white, fontSize: 21, fontWeight: "900", marginTop: 4 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  inlineTitle: { flexDirection: "row", alignItems: "center" },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: "900" },
  helperText: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  outlineButton: { borderWidth: 1, borderColor: COLORS.red, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  outlineWideButton: { borderWidth: 1, borderColor: COLORS.red, borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  outlineButtonText: { color: "#ff5a52", fontSize: 12, fontWeight: "800" },
  sessionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dateBadge: {
    width: 64,
    height: 82,
    borderRadius: 10,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dateMonth: { color: COLORS.red, fontSize: 12, fontWeight: "900" },
  dateDay: { color: COLORS.white, fontSize: 28, fontWeight: "900", lineHeight: 32 },
  dateWeekday: { color: COLORS.muted, fontSize: 14, fontWeight: "800" },
  sessionArt: { width: 70, height: 82, borderRadius: 10, backgroundColor: "#0f2741", marginRight: 12 },
  sessionInfo: { flex: 1 },
  sessionTitle: { color: COLORS.white, fontSize: 15, fontWeight: "900" },
  sessionText: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  sessionAccent: { color: "#ff6b5f", fontSize: 12, marginTop: 4 },
  chevron: { color: COLORS.white, fontSize: 24 },
  primaryButton: { backgroundColor: COLORS.redDark, borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  primaryButtonSmall: { backgroundColor: COLORS.redDark, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16 },
  primaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: "900" },
  secondaryButton: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 14, alignItems: "center", width: "100%", marginTop: 10 },
  secondaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: "800" },
  calendarTitle: { color: COLORS.gold, fontSize: 18, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayName: { width: "14.285%", textAlign: "center", color: COLORS.muted, fontSize: 10, marginBottom: 8 },
  dayCell: { width: "14.285%", height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18 },
  dayCellCompact: { height: 28 },
  dayNum: { color: COLORS.white, fontSize: 15 },
  dayNumCompact: { fontSize: 13 },
  selectedDay: { backgroundColor: COLORS.redDark },
  proposedDay: { borderWidth: 1, borderColor: COLORS.blue },
  activeDayText: { fontWeight: "900" },
  eventDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.blue, marginTop: 2 },
  goldDot: { backgroundColor: COLORS.gold },
  legendRow: { flexDirection: "row", marginTop: 10, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: COLORS.muted, fontSize: 11, marginLeft: 6 },
  availabilityRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#1f1f1f" },
  responseButtons: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  voteButton: { borderWidth: 1, borderColor: COLORS.red, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  voteSelected: { backgroundColor: COLORS.redDark },
  voteButtonMuted: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  voteAvailable: { backgroundColor: "#166534", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginRight: 8 },
  voteUnavailable: { backgroundColor: COLORS.redDark, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  voteButtonText: { color: COLORS.white, fontSize: 11, fontWeight: "900" },
  voteMutedText: { color: COLORS.muted, fontSize: 11, fontWeight: "900" },
  quickGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  quickAction: { width: "31.5%", minHeight: 92, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 10, justifyContent: "center", backgroundColor: "#0d0d0d" },
  quickLabel: { color: COLORS.white, fontSize: 12, fontWeight: "900", marginTop: 6 },
  quickDetail: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  searchRow: { marginBottom: 12 },
  searchText: { color: COLORS.muted, backgroundColor: COLORS.panel2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 10 },
  smallRedButton: { backgroundColor: COLORS.redDark, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, alignSelf: "flex-end" },
  smallRedButtonText: { color: COLORS.white, fontSize: 12, fontWeight: "900" },
  campaignCard: { flexDirection: "row", alignItems: "center" },
  campaignArt: { width: 74, height: 88, borderRadius: 10, marginRight: 12 },
  campaignInfo: { flex: 1 },
  campaignTitle: { color: COLORS.white, fontSize: 15, fontWeight: "900" },
  badge: { backgroundColor: COLORS.redDark, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, marginRight: 6 },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: "900" },
  listHeading: { color: COLORS.white, fontSize: 16, fontWeight: "900", marginBottom: 10, marginTop: 4 },
  eventInfo: { flex: 1 },
  playerRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#3f1d1d", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { color: COLORS.white, fontWeight: "900" },
  playerInfo: { flex: 1 },
  moreDots: { color: COLORS.muted, fontSize: 18 },
  quickAvailability: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  resultRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  resultInfo: { flex: 1, marginLeft: 10 },
  resultName: { color: COLORS.white, fontSize: 13, fontWeight: "800" },
  resultMeta: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  resultTotal: { backgroundColor: "#14532d", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  resultTotalText: { color: COLORS.white, fontWeight: "900" },
  detailsHero: { height: 145, borderRadius: 12, backgroundColor: "#0f2741", marginBottom: 14 },
  detailsTitle: { color: COLORS.white, fontSize: 22, fontWeight: "900" },
  infoLine: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  infoText: { color: COLORS.white, fontSize: 14, marginLeft: 10 },
  notesText: { color: COLORS.muted, lineHeight: 20, marginBottom: 16 },
  profileLogo: { width: 118, height: 118, alignSelf: "center", marginBottom: 14 },
  aboutCard: { alignItems: "center" },
  aboutLogo: { width: 190, height: 190, marginBottom: 14 },
  aboutTitle: { color: COLORS.gold, fontSize: 30, fontWeight: "900", textAlign: "center", marginBottom: 8 },
  settingsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  logoutButton: { backgroundColor: "rgba(153, 27, 27, 0.25)", borderWidth: 1, borderColor: COLORS.red, borderRadius: 12, paddingVertical: 15, alignItems: "center", marginBottom: 12 },
  logoutText: { color: COLORS.red, fontSize: 16, fontWeight: "900" },
  deleteAccountButton: { backgroundColor: "rgba(127, 29, 29, 0.22)", borderWidth: 1, borderColor: "#7f1d1d", borderRadius: 12, paddingVertical: 15, alignItems: "center", marginBottom: 28 },
  deleteAccountText: { color: "#f87171", fontSize: 16, fontWeight: "900" },
  planTitle: { color: COLORS.gold, fontSize: 28, fontWeight: "900", marginTop: 8 },
  planPrice: { color: COLORS.gold, fontSize: 15, fontWeight: "900" },
  activePlanCard: { borderColor: COLORS.gold },
  activePlanButton: { backgroundColor: COLORS.gold, borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  activePlanText: { color: "#111111", fontSize: 13, fontWeight: "900" },
  planFeatureRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  planCheck: { color: COLORS.green, fontSize: 14, fontWeight: "900", marginTop: 1, marginRight: 8 },
  planFeatureText: { color: COLORS.muted, fontSize: 12, flex: 1, lineHeight: 18 },
  confirmBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.82)", alignItems: "center", justifyContent: "center", padding: 18 },
  confirmBox: { width: "100%", maxWidth: 420, backgroundColor: COLORS.bg, borderRadius: 18, borderWidth: 1, borderColor: COLORS.red, padding: 20 },
  confirmIcon: { color: COLORS.red, fontSize: 46, textAlign: "center", marginBottom: 8 },
  confirmTitle: { color: COLORS.white, fontSize: 24, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  confirmText: { color: COLORS.muted, fontSize: 13, lineHeight: 20, textAlign: "center", marginBottom: 10 },
  confirmLabel: { color: COLORS.white, fontSize: 13, fontWeight: "800", marginTop: 8, marginBottom: 8 },
  deleteInput: { height: 48, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, color: COLORS.white, paddingHorizontal: 12, backgroundColor: COLORS.panel2, marginBottom: 12 },
  deleteConfirmButton: { backgroundColor: COLORS.redDark, borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  disabledButton: { opacity: 0.4 },
  deleteConfirmText: { color: COLORS.white, fontSize: 15, fontWeight: "900" },
  cancelDeleteButton: { backgroundColor: COLORS.panel2, borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  cancelDeleteText: { color: COLORS.white, fontSize: 15, fontWeight: "800" },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === "android" ? 92 : 96,
    paddingBottom: Platform.OS === "android" ? 20 : 28,
    paddingTop: 10,
    paddingHorizontal: 6,
    backgroundColor: "rgba(5,5,5,0.99)",
    borderTopWidth: 1,
    borderTopColor: "#171717",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navIcon: { color: COLORS.muted, fontSize: 20, lineHeight: 22 },
  navLabel: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  navActive: { color: COLORS.red },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "flex-end" },
  drawer: { maxHeight: "88%", backgroundColor: COLORS.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 16, paddingBottom: 30, borderWidth: 1, borderColor: COLORS.border },
  drawerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  drawerTitle: { color: COLORS.white, fontSize: 24, fontWeight: "900" },
  closeText: { color: COLORS.white, fontSize: 34 },
  menuGroup: { color: COLORS.white, fontSize: 13, fontWeight: "900", textTransform: "uppercase", marginBottom: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  menuItemText: { color: COLORS.white, fontSize: 15 },
});
