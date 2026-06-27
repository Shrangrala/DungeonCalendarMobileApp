import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  bg: "#050505",
  panel: "rgba(15, 15, 15, 0.96)",
  panel2: "rgba(22, 22, 22, 0.96)",
  border: "#2a2a2a",
  borderStrong: "#5b1717",
  red: "#dc2626",
  redDark: "#991b1b",
  gold: "#f3c76a",
  white: "#f8fafc",
  muted: "#a1a1aa",
  green: "#22c55e",
  blue: "#60a5fa",
};

const campaigns = [
  {
    id: "curse",
    name: "Curse of Strahd",
    level: "Level 7",
    next: "May 24, 2025",
    dm: "You",
    status: "Active",
    color: "#3b0764",
  },
  {
    id: "storm",
    name: "Storm King’s Thunder",
    level: "Level 5",
    next: "May 31, 2025",
    dm: "You",
    status: "Active",
    color: "#0f172a",
  },
  {
    id: "waterdeep",
    name: "Waterdeep: Dragon Heist",
    level: "Level 3",
    next: "Jun 7, 2025",
    dm: "You",
    status: "Active",
    color: "#431407",
  },
  {
    id: "lost",
    name: "Lost Mines of Phandelver",
    level: "Level 2",
    next: "Jun 14, 2025",
    dm: "You",
    status: "Active",
    color: "#14532d",
  },
];

const recentResults = [
  { name: "Acrobatics (Dexterity)", date: "May 18, 2025", roll: "3d20 + 5", total: 18 },
  { name: "Perception (Wisdom)", date: "May 18, 2025", roll: "1d20 + 2", total: 14 },
  { name: "Stealth (Dexterity)", date: "May 17, 2025", roll: "2d20 + 6", total: 21 },
];

const events = [
  { month: "MAY", day: "24", weekday: "SAT", title: "Storm King’s Thunder", time: "6:00 PM – 10:00 PM", place: "Tom’s House", type: "Game Night" },
  { month: "MAY", day: "31", weekday: "SAT", title: "Curse of Strahd", time: "6:30 PM – 10:30 PM", place: "Tom’s House", type: "Game Night" },
  { month: "JUN", day: "07", weekday: "SAT", title: "Waterdeep: Dragon Heist", time: "5:00 PM – 9:00 PM", place: "Tom’s House", type: "Game Night" },
];

function IconText({ icon, color = COLORS.red }) {
  return <Text style={[styles.iconText, { color }]}>{icon}</Text>;
}

function Header({ title, subtitle, onMenu }) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image source={require("./assets/dungeon-calendar-logo.png")} style={styles.logo} resizeMode="contain" />
        <View style={styles.brandTextWrap}>
          <Text style={styles.brandTitle}>Dungeon</Text>
          <Text style={styles.brandTitleGold}>Calendar</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.cogButton} onPress={onMenu} activeOpacity={0.8}>
        <Text style={styles.cogText}>⚙</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function StatCard({ icon, label, value, color }) {
  return (
    <Card style={styles.statCard}>
      <IconText icon={icon} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );
}

function CampaignSelector() {
  return (
    <TouchableOpacity style={styles.selector} activeOpacity={0.85}>
      <Text style={styles.selectorIcon}>⚜</Text>
      <Text style={styles.selectorText}>Curse of Strahd</Text>
      <Text style={styles.selectorChevron}>⌄</Text>
    </TouchableOpacity>
  );
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

function Dashboard({ onMenu, navigate }) {
  return (
    <Screen>
      <Header title="Welcome back," subtitle="DM (You)" onMenu={onMenu} />
      <CampaignSelector />

      <View style={styles.statsGrid}>
        <StatCard icon="▣" label="Campaigns" value="12" color={COLORS.gold} />
        <StatCard icon="◷" label="Sessions" value="48" color={COLORS.red} />
        <StatCard icon="▥" label="Results" value="156" color={COLORS.blue} />
        <StatCard icon="♟" label="Players" value="5" color={COLORS.green} />
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.inlineTitle}>
            <IconText icon="▣" />
            <Text style={styles.sectionTitle}>Upcoming Session</Text>
          </View>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Auto Pick Best Date</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sessionRow}>
          <DateBadge month="MAY" day="24" weekday="SAT" />
          <View style={styles.sessionArt} />
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>Storm King’s Thunder</Text>
            <Text style={styles.sessionText}>6:00 PM – 10:00 PM</Text>
            <Text style={styles.sessionAccent}>Tom’s House</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigate("details")}>
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
        <MiniCalendar />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <QuickAction icon="▣" label="Add Campaign" onPress={() => navigate("campaigns")} />
          <QuickAction icon="▣" label="Add Event" onPress={() => navigate("calendar")} />
          <QuickAction icon="◇" label="Add Result" onPress={() => navigate("results")} />
          <QuickAction icon="▥" label="View Results" onPress={() => navigate("results")} />
        </View>
      </Card>
    </Screen>
  );
}

function MiniCalendar() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const nums = ["27", "28", "29", "30", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
  return (
    <View>
      <Text style={styles.calendarTitle}>May 2025</Text>
      <View style={styles.calendarGrid}>
        {days.map((d) => (
          <Text key={d} style={styles.dayName}>{d}</Text>
        ))}
        {nums.map((n, idx) => (
          <View key={`${n}-${idx}`} style={[styles.dayCell, n === "24" && idx > 20 ? styles.activeDay : null]}>
            <Text style={[styles.dayNum, n === "24" && idx > 20 ? styles.activeDayText : null]}>{n}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.85}>
      <IconText icon={icon} />
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function Campaigns({ onMenu }) {
  return (
    <Screen>
      <Header title="Campaigns" onMenu={onMenu} />
      <View style={styles.searchRow}>
        <Text style={styles.searchText}>⌕  Search campaigns...</Text>
        <TouchableOpacity style={styles.smallRedButton}><Text style={styles.smallRedButtonText}>+ Add Campaign</Text></TouchableOpacity>
      </View>
      {campaigns.map((c) => (
        <Card key={c.id} style={styles.campaignCard}>
          <View style={[styles.campaignArt, { backgroundColor: c.color }]} />
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignTitle}>{c.name}</Text>
            <Text style={styles.sessionText}>{c.level}</Text>
            <Text style={styles.sessionText}>Next Session: {c.next}</Text>
            <Text style={styles.sessionText}>DM: {c.dm}</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>{c.status}</Text></View>
        </Card>
      ))}
    </Screen>
  );
}

function CalendarScreen({ onMenu, navigate }) {
  return (
    <Screen>
      <Header title="Calendar" onMenu={onMenu} />
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.calendarTitle}>May 2025</Text>
          <TouchableOpacity style={styles.smallRedButton}><Text style={styles.smallRedButtonText}>+ Add Event</Text></TouchableOpacity>
        </View>
        <MiniCalendar />
      </Card>
      <Text style={styles.listHeading}>Upcoming Events</Text>
      {events.map((e, i) => (
        <TouchableOpacity key={i} onPress={() => navigate("details")} activeOpacity={0.86}>
          <Card style={styles.eventCard}>
            <DateBadge month={e.month} day={e.day} weekday={e.weekday} />
            <View style={styles.eventInfo}>
              <Text style={styles.sessionTitle}>{e.title}</Text>
              <Text style={styles.sessionText}>{e.time}</Text>
              <Text style={styles.sessionAccent}>{e.type}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Card>
        </TouchableOpacity>
      ))}
    </Screen>
  );
}

function Results({ onMenu }) {
  return (
    <Screen>
      <Header title="Results" onMenu={onMenu} />
      <View style={styles.tabs}>
        {["All Results", "Ability Checks", "Saves", "Attacks"].map((t, i) => (
          <Text key={t} style={[styles.tab, i === 0 && styles.activeTab]}>{t}</Text>
        ))}
      </View>
      <Card>
        <Text style={styles.sectionTitle}>Recent Results</Text>
        {recentResults.map((r) => (
          <View key={r.name} style={styles.resultRow}>
            <IconText icon="▥" />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{r.name}</Text>
              <Text style={styles.resultMeta}>{r.date} · {r.roll}</Text>
            </View>
            <View style={styles.resultTotal}><Text style={styles.resultTotalText}>{r.total}</Text></View>
          </View>
        ))}
      </Card>
      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <Text style={styles.sessionText}>All Time ▾</Text>
        </View>
        <View style={styles.statsGrid3}>
          <MiniStat value="87" label="Checks" />
          <MiniStat value="24" label="Nat 20s" />
          <MiniStat value="18" label="Failures" />
        </View>
      </Card>
    </Screen>
  );
}

function MiniStat({ value, label }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SessionDetails({ onMenu }) {
  return (
    <Screen>
      <Header title="Session Details" onMenu={onMenu} />
      <Card>
        <View style={styles.detailsHero} />
        <Text style={styles.detailsTitle}>Storm King’s Thunder</Text>
        <Text style={styles.sessionText}>Level 5</Text>
        <InfoLine icon="▣" text="Saturday, May 24, 2025" />
        <InfoLine icon="◷" text="6:00 PM – 10:00 PM (4h)" />
        <InfoLine icon="♟" text="5 / 6 Players" />
        <InfoLine icon="⌖" text="Tom’s House" />
        <Text style={styles.listHeading}>Players</Text>
        <View style={styles.avatarRow}>
          {["DM", "A", "B", "C", "J"].map((a) => <View key={a} style={styles.avatar}><Text style={styles.avatarText}>{a}</Text></View>)}
          <View style={[styles.avatar, styles.addAvatar]}><Text style={styles.avatarText}>+</Text></View>
        </View>
        <Text style={styles.listHeading}>Notes</Text>
        <Text style={styles.notesText}>The party heads into the Eye of the All-Father to confront the frost giant threat. Bring extra dice!</Text>
        <TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>I’m Going</Text></TouchableOpacity>
      </Card>
    </Screen>
  );
}

function InfoLine({ icon, text }) {
  return <View style={styles.infoLine}><IconText icon={icon} color={COLORS.gold} /><Text style={styles.infoText}>{text}</Text></View>;
}

function Characters({ onMenu }) {
  return (
    <Screen>
      <Header title="Characters" onMenu={onMenu} />
      {["Aelar Moonbrook", "Thorn Blackshield", "Mira Emberhand"].map((name, idx) => (
        <Card key={name} style={styles.eventCard}>
          <View style={[styles.avatar, { width: 54, height: 54 }]}><Text style={styles.avatarText}>{name[0]}</Text></View>
          <View style={styles.eventInfo}>
            <Text style={styles.sessionTitle}>{name}</Text>
            <Text style={styles.sessionText}>Level {idx + 3} Adventurer</Text>
            <Text style={styles.sessionAccent}>HP {28 + idx * 8} · AC {14 + idx}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Card>
      ))}
    </Screen>
  );
}

function Screen({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuModal({ visible, onClose, navigate }) {
  const menuItems = [
    ["Recent Results", "results"],
    ["Campaign Settings", "campaigns"],
    ["Dice Settings", "results"],
    ["Notification Settings", "dashboard"],
    ["Account Settings", "dashboard"],
    ["Backup & Sync", "dashboard"],
    ["Privacy Policy", "dashboard"],
    ["Terms of Service", "dashboard"],
    ["Help & Support", "dashboard"],
    ["About Dungeon Calendar", "dashboard"],
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.closeText}>×</Text></TouchableOpacity>
          </View>

          <Card>
            <Text style={styles.menuGroup}>Recent Results</Text>
            {recentResults.map((r) => (
              <View key={r.name} style={styles.resultRow}>
                <IconText icon="▥" />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{r.name}</Text>
                  <Text style={styles.resultMeta}>{r.date}</Text>
                </View>
                <Text style={styles.resultTotalText}>{r.total}</Text>
              </View>
            ))}
          </Card>

          <Card>
            <Text style={styles.menuGroup}>Settings</Text>
            {menuItems.slice(1).map(([label, route]) => (
              <TouchableOpacity key={label} style={styles.menuItem} onPress={() => { onClose(); navigate(route); }}>
                <Text style={styles.menuItemText}>{label}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuItemText, { color: COLORS.red }]}>Log Out</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

function BottomNav({ route, setRoute, openMenu }) {
  const items = [
    ["dashboard", "⌂", "Dashboard"],
    ["calendar", "▣", "Calendar"],
    ["campaigns", "◈", "Campaigns"],
    ["characters", "♙", "Characters"],
    ["more", "•••", "More"],
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map(([key, icon, label]) => {
        const active = route === key;
        const onPress = key === "more" ? openMenu : () => setRoute(key);
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
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (next) => {
    if (next === "more") {
      setMenuOpen(true);
    } else {
      setRoute(next);
    }
  };

  const currentScreen = useMemo(() => {
    const props = { onMenu: () => setMenuOpen(true), navigate };
    switch (route) {
      case "calendar":
        return <CalendarScreen {...props} />;
      case "campaigns":
        return <Campaigns {...props} />;
      case "characters":
        return <Characters {...props} />;
      case "results":
        return <Results {...props} />;
      case "details":
        return <SessionDetails {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  }, [route]);

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      {currentScreen}
      <BottomNav route={route} setRoute={setRoute} openMenu={() => setMenuOpen(true)} />
      <MenuModal visible={menuOpen} onClose={() => setMenuOpen(false)} navigate={navigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: COLORS.bg },
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 46 : 18,
    paddingBottom: 116,
  },
  header: {
    paddingTop: 8,
    marginBottom: 14,
    minHeight: 154,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingRight: 70,
  },
  logo: {
    width: 86,
    height: 86,
    marginRight: 12,
  },
  brandTextWrap: {
    justifyContent: "center",
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 31,
  },
  brandTitleGold: {
    color: COLORS.gold,
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 31,
  },
  cogButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 18 : 8,
    right: 0,
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.red,
    backgroundColor: "rgba(10,10,10,0.92)",
  },
  cogText: {
    color: COLORS.gold,
    fontSize: 26,
  },
  pageTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
  },
  pageSubtitle: {
    color: COLORS.gold,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
  },
  selector: {
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  selectorIcon: { color: COLORS.gold, fontSize: 20, marginRight: 10 },
  selectorText: { color: COLORS.white, fontWeight: "700", fontSize: 15, flex: 1 },
  selectorChevron: { color: COLORS.red, fontSize: 20 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    width: "48.5%",
    minHeight: 100,
  },
  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  iconText: { fontSize: 22, fontWeight: "800" },
  statLabel: { color: COLORS.muted, fontSize: 12, marginTop: 9 },
  statValue: { color: COLORS.white, fontSize: 24, fontWeight: "900", marginTop: 4 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  inlineTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: "900" },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  outlineButtonText: { color: "#ff5a52", fontWeight: "700", fontSize: 12 },
  sessionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dateBadge: {
    width: 64,
    height: 82,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    marginRight: 12,
  },
  dateMonth: { color: COLORS.red, fontWeight: "900", fontSize: 12 },
  dateDay: { color: COLORS.white, fontWeight: "900", fontSize: 28, lineHeight: 32 },
  dateWeekday: { color: COLORS.muted, fontWeight: "700", fontSize: 14 },
  sessionArt: {
    width: 70,
    height: 82,
    borderRadius: 10,
    backgroundColor: "#0f2741",
    marginRight: 12,
  },
  sessionInfo: { flex: 1 },
  sessionTitle: { color: COLORS.white, fontSize: 15, fontWeight: "900" },
  sessionText: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  sessionAccent: { color: "#ff6b5f", fontSize: 12, marginTop: 4 },
  chevron: { color: COLORS.white, fontSize: 24 },
  primaryButton: {
    backgroundColor: COLORS.redDark,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: COLORS.white, fontWeight: "900", fontSize: 15 },
  calendarTitle: { color: COLORS.white, fontSize: 16, fontWeight: "800", textAlign: "center", marginBottom: 10 },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayName: { width: "14.285%", color: COLORS.muted, textAlign: "center", fontSize: 10, marginBottom: 8 },
  dayCell: { width: "14.285%", alignItems: "center", justifyContent: "center", height: 28 },
  dayNum: { color: COLORS.white, fontSize: 14 },
  activeDay: { backgroundColor: COLORS.redDark, borderRadius: 18 },
  activeDayText: { fontWeight: "900" },
  quickGrid: { flexDirection: "row", gap: 8, marginTop: 12 },
  quickAction: {
    flex: 1,
    minHeight: 82,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#0d0d0d",
  },
  quickLabel: { color: COLORS.white, fontSize: 11, textAlign: "center", marginTop: 6, fontWeight: "700" },
  searchRow: { marginBottom: 12 },
  searchText: {
    color: COLORS.muted,
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  smallRedButton: {
    backgroundColor: COLORS.redDark,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "flex-end",
  },
  smallRedButtonText: { color: COLORS.white, fontWeight: "800", fontSize: 12 },
  campaignCard: { flexDirection: "row", alignItems: "center" },
  campaignArt: { width: 74, height: 88, borderRadius: 10, marginRight: 12 },
  campaignInfo: { flex: 1 },
  campaignTitle: { color: COLORS.white, fontWeight: "900", fontSize: 15 },
  badge: { backgroundColor: COLORS.redDark, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: "800" },
  listHeading: { color: COLORS.white, fontSize: 16, fontWeight: "900", marginBottom: 10, marginTop: 4 },
  eventCard: { flexDirection: "row", alignItems: "center" },
  eventInfo: { flex: 1 },
  tabs: { flexDirection: "row", gap: 14, marginBottom: 12 },
  tab: { color: COLORS.muted, fontSize: 12, paddingBottom: 8 },
  activeTab: { color: COLORS.red, borderBottomWidth: 2, borderBottomColor: COLORS.red },
  resultRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  resultInfo: { flex: 1, marginLeft: 10 },
  resultName: { color: COLORS.white, fontWeight: "800", fontSize: 13 },
  resultMeta: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  resultTotal: { backgroundColor: "#14532d", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  resultTotalText: { color: COLORS.white, fontWeight: "900" },
  statsGrid3: { flexDirection: "row", gap: 10 },
  miniStat: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, alignItems: "center" },
  detailsHero: { height: 145, backgroundColor: "#0f2741", borderRadius: 12, marginBottom: 14 },
  detailsTitle: { color: COLORS.white, fontSize: 22, fontWeight: "900" },
  infoLine: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
  infoText: { color: COLORS.white, fontSize: 14 },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#3f1d1d", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border },
  addAvatar: { borderColor: COLORS.red, backgroundColor: "transparent" },
  avatarText: { color: COLORS.white, fontWeight: "900" },
  notesText: { color: COLORS.muted, lineHeight: 20, marginBottom: 16 },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === "android" ? 92 : 96,
    paddingBottom: Platform.OS === "android" ? 20 : 28,
    paddingTop: 10,
    paddingHorizontal: 6,
    backgroundColor: "rgba(5,5,5,0.98)",
    borderTopWidth: 1,
    borderTopColor: "#151515",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navIcon: { color: COLORS.muted, fontSize: 20, lineHeight: 22 },
  navLabel: { color: COLORS.muted, fontSize: 10, marginTop: 3 },
  navActive: { color: COLORS.red },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "flex-end" },
  drawer: {
    maxHeight: "88%",
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  drawerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  drawerTitle: { color: COLORS.white, fontSize: 24, fontWeight: "900" },
  closeText: { color: COLORS.white, fontSize: 34 },
  menuGroup: { color: COLORS.white, fontWeight: "900", fontSize: 13, textTransform: "uppercase", marginBottom: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  menuItemText: { color: COLORS.white, fontSize: 15 },
});
