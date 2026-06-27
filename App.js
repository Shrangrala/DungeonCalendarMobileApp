import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInToFirebaseWithGoogleIdToken, signOut as firebaseSignOut } from './firebase';

const WEB_CLIENT_ID = '1089961645011-3ts4dr2p473lnobgch0k5p7abk5rbeu9.apps.googleusercontent.com';
const SITE_URL = 'https://www.dungeoncalendar.com';

const campaignArt = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=500&q=80',
];

function Icon({ children, color = '#ef4444' }) {
  return <Text style={[styles.icon, { color }]}>{children}</Text>;
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function StatCard({ icon, label, value, color }) {
  return (
    <Card style={styles.statCard}>
      <Icon color={color}>{icon}</Icon>
      <Text style={styles.mutedSmall}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );
}

function Header({ title, subtitle, onMenu }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.logoText}>Dungeon{`\n`}Calendar</Text>
        {title ? <Text style={styles.screenTitle}>{title}</Text> : null}
        {subtitle ? <Text style={styles.redText}>{subtitle}</Text> : null}
      </View>
      <Pressable onPress={onMenu} style={styles.gearButton}>
        <Text style={styles.gearText}>⚙</Text>
      </Pressable>
    </View>
  );
}

function Dashboard({ onMenu, openWeb }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Welcome back," subtitle="Curse of Strahd" onMenu={onMenu} />
      <Text style={styles.heroName}>DM (You)</Text>
      <Pressable style={styles.campaignSelector} onPress={() => openWeb('/dashboard')}>
        <Text style={styles.selectorText}>Curse of Strahd</Text>
        <Text style={styles.selectorArrow}>⌄</Text>
      </Pressable>
      <View style={styles.statsGrid}>
        <StatCard icon="▣" label="Campaigns" value="12" color="#fbbf24" />
        <StatCard icon="◷" label="Sessions" value="48" color="#ef4444" />
        <StatCard icon="▥" label="Results" value="156" color="#60a5fa" />
        <StatCard icon="♟" label="Players" value="5" color="#34d399" />
      </View>
      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.rowCenter}><Icon>▣</Icon><Text style={styles.sectionTitle}>Upcoming Session</Text></View>
          <Pressable style={styles.outlineButton} onPress={() => openWeb('/dashboard')}><Text style={styles.outlineButtonText}>Auto Pick Best Date</Text></Pressable>
        </View>
        <Pressable onPress={() => openWeb('/calendar')} style={styles.sessionRow}>
          <View style={styles.datePill}><Text style={styles.dateMonth}>MAY</Text><Text style={styles.dateDay}>24</Text><Text style={styles.dateDow}>SAT</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Storm King’s Thunder</Text>
            <Text style={styles.muted}>6:00 PM – 10:00 PM</Text>
            <Text style={styles.redText}>Tom’s House</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => openWeb('/calendar')}><Text style={styles.primaryButtonText}>Open Session</Text></Pressable>
      </Card>
      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Calendar Overview</Text>
          <Pressable style={styles.outlineButton} onPress={() => openWeb('/calendar')}><Text style={styles.outlineButtonText}>Open Calendar</Text></Pressable>
        </View>
        <View style={styles.weekRow}>{['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => <Text key={d} style={styles.weekLabel}>{d}</Text>)}</View>
        <View style={styles.weekRow}>{['18','19','20','21','22','23','24'].map(d => <View key={d} style={d === '24' ? styles.activeDay : styles.dayCircle}><Text style={styles.dayText}>{d}</Text></View>)}</View>
        <Text style={styles.mutedCenter}>May 18 – May 24, 2025</Text>
      </Card>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        {[
          ['▣','Add Campaign','/dashboard'],
          ['▤','Add Event','/calendar'],
          ['▥','Add Result','/results'],
          ['▧','View Results','/results'],
        ].map(([ic, label, path]) => (
          <Pressable key={label} style={styles.quickCard} onPress={() => openWeb(path)}>
            <Icon>{ic}</Icon><Text style={styles.quickTitle}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function Campaigns({ onMenu, openWeb }) {
  const campaigns = ['Curse of Strahd', 'Storm King’s Thunder', 'Waterdeep: Dragon Heist', 'Lost Mines of Phandelver', 'Ravnica Campaign'];
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Campaigns" onMenu={onMenu} />
      <View style={styles.rowBetween}>
        <View style={styles.searchBox}><Text style={styles.muted}>⌕ Search campaigns...</Text></View>
        <Pressable style={styles.smallRedButton} onPress={() => openWeb('/dashboard')}><Text style={styles.smallRedButtonText}>+ Add</Text></Pressable>
      </View>
      {campaigns.map((name, i) => (
        <Pressable key={name} style={styles.campaignCard} onPress={() => openWeb('/dashboard')}>
          <Image source={{ uri: campaignArt[i % campaignArt.length] }} style={styles.campaignImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{name}</Text>
            <Text style={styles.muted}>Level {i + 2}</Text>
            <Text style={styles.muted}>Next Session: May {24 + i * 2}, 2025</Text>
            <Text style={styles.muted}>DM: You</Text>
          </View>
          <View style={i === 4 ? styles.completeBadge : styles.activeBadge}><Text style={styles.badgeText}>{i === 4 ? 'Completed' : 'Active'}</Text></View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function Calendar({ onMenu, openWeb }) {
  const days = ['27','28','29','30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Calendar" onMenu={onMenu} />
      <View style={styles.rowBetween}>
        <Text style={styles.chevron}>‹</Text><Text style={styles.sectionTitle}>May 2025</Text><Text style={styles.chevron}>›</Text>
      </View>
      <View style={styles.monthGrid}>{['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => <Text key={d} style={styles.monthLabel}>{d}</Text>)}{days.map(d => <View key={d + Math.random()} style={d === '24' ? styles.monthActive : styles.monthDay}><Text style={styles.dayText}>{d}</Text></View>)}</View>
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      {['Storm King’s Thunder','Curse of Strahd','Waterdeep: Dragon Heist'].map((name, i) => (
        <Pressable key={name} style={styles.sessionRowCard} onPress={() => openWeb('/calendar')}>
          <View style={styles.datePill}><Text style={styles.dateMonth}>{i === 2 ? 'JUN' : 'MAY'}</Text><Text style={styles.dateDay}>{i === 0 ? '24' : i === 1 ? '31' : '07'}</Text><Text style={styles.dateDow}>SAT</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.cardTitle}>{name}</Text><Text style={styles.muted}>6:00 PM – 10:00 PM</Text><Text style={styles.redText}>Game Night</Text></View><Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
      <Pressable style={styles.floatingButton} onPress={() => openWeb('/calendar')}><Text style={styles.floatingText}>+</Text></Pressable>
    </ScrollView>
  );
}

function Results({ onMenu, openWeb }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Results" onMenu={onMenu} />
      <View style={styles.tabRow}>{['All Results','Ability Checks','Saves','Attacks'].map((t,i)=><Text key={t} style={i===0?styles.activeTab:styles.tabText}>{t}</Text>)}</View>
      <Card><Text style={styles.sectionTitle}>Recent Results</Text>{[['Acrobatics (Dexterity)','18'],['Perception (Wisdom)','14'],['Stealth (Dexterity)','21']].map(([n,v])=><View key={n} style={styles.resultRow}><Icon>▥</Icon><View style={{flex:1}}><Text style={styles.cardTitle}>{n}</Text><Text style={styles.mutedSmall}>May 18, 2025 · 3d20 + 5</Text></View><View style={styles.scoreBadge}><Text style={styles.scoreText}>{v}</Text></View></View>)}<Pressable style={styles.primaryButton} onPress={() => openWeb('/results')}><Text style={styles.primaryButtonText}>View All Results</Text></Pressable></Card>
      <Card><View style={styles.rowBetween}><Text style={styles.sectionTitle}>Statistics</Text><Text style={styles.pill}>All Time⌄</Text></View><View style={styles.statsGrid}><StatCard icon="" label="Checks" value="87" color="#ef4444" /><StatCard icon="" label="Nat 20s" value="24" color="#ef4444" /><StatCard icon="" label="Failures" value="18" color="#ef4444" /></View></Card>
    </ScrollView>
  );
}

function Characters({ onMenu, openWeb }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="Characters" onMenu={onMenu} />
      {['Shrangrala','Brandon','Cody','Jessica'].map((name, i)=><Pressable key={name} style={styles.campaignCard} onPress={() => openWeb('/dashboard')}><View style={styles.avatar}><Text style={styles.avatarText}>{name[0]}</Text></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{name}</Text><Text style={styles.muted}>Level {i+3} Adventurer</Text><Text style={styles.muted}>HP {24+i*5} · AC {14+i}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}
    </ScrollView>
  );
}

function Menu({ visible, onClose, openWeb, onSignOut }) {
  const items = [
    ['▥','Recent Results','/results'],['⚙','Campaign Settings','/dashboard'],['◇','Dice Settings','/results'],['♢','Notification Settings','/dashboard'],['♙','Account Settings','/dashboard'],['☁','Backup & Sync','/dashboard'],['?','Help & Support','/about'],['ⓘ','About Dungeon Calendar','/about'],['▣','Privacy Policy','/privacy'],['§','Terms of Service','/terms'],
  ];
  return <Modal visible={visible} animationType="slide" transparent><View style={styles.modalBackdrop}><View style={styles.drawer}><View style={styles.rowBetween}><Text style={styles.screenTitle}>Menu</Text><Pressable onPress={onClose}><Text style={styles.closeText}>×</Text></Pressable></View><Card><Text style={styles.menuHeader}>RECENT RESULTS</Text>{[['Acrobatics (Dexterity)','18'],['Perception (Wisdom)','14'],['Stealth (Dexterity)','21']].map(([n,v])=><View key={n} style={styles.resultRow}><Icon>▥</Icon><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{n}</Text><Text style={styles.mutedSmall}>May 18, 2025</Text></View><Text style={styles.statValue}>{v}</Text></View>)}</Card><Card><Text style={styles.menuHeader}>SETTINGS</Text>{items.slice(1,6).map(([ic,label,path])=><Pressable key={label} style={styles.menuItem} onPress={() => openWeb(path)}><Text style={styles.menuIcon}>{ic}</Text><Text style={styles.menuText}>{label}</Text><Text style={styles.chevron}>›</Text></Pressable>)}</Card><Card><Text style={styles.menuHeader}>OTHER</Text>{items.slice(6).map(([ic,label,path])=><Pressable key={label} style={styles.menuItem} onPress={() => openWeb(path)}><Text style={styles.menuIcon}>{ic}</Text><Text style={styles.menuText}>{label}</Text><Text style={styles.chevron}>›</Text></Pressable>)}<Pressable style={styles.menuItem} onPress={onSignOut}><Text style={styles.menuIcon}>⇥</Text><Text style={[styles.menuText,{color:'#ef4444'}]}>Log Out</Text></Pressable></Card><Text style={styles.version}>Version 1.0.12</Text></View></View></Modal>;
}

function AuthScreen({ onGoogle, onEmail, error }) {
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" backgroundColor="#050505" /><View style={styles.authWrap}><Text style={styles.authLogo}>Dungeon{`\n`}Calendar</Text><Text style={styles.authTitle}>Plan campaigns, sessions, NPCs, maps, and adventures.</Text><Pressable style={styles.googleButton} onPress={onGoogle}><Text style={styles.googleText}>Sign in with Google</Text></Pressable><Pressable onPress={onEmail}><Text style={styles.emailLink}>Use email login instead</Text></Pressable>{error ? <Text style={styles.errorText}>{error}</Text> : null}<Text style={styles.authFooter}>Uses your same Dungeon Calendar web account.</Text></View></SafeAreaView>;
}

function WebModal({ url, onClose }) {
  return <Modal visible={!!url} animationType="slide"><SafeAreaView style={styles.safe}><View style={styles.webHeader}><Pressable onPress={onClose}><Text style={styles.closeText}>×</Text></Pressable><Text style={styles.webTitle}>Dungeon Calendar</Text><View style={{width:32}} /></View>{url ? <WebView source={{ uri: url }} style={{ flex: 1 }} javaScriptEnabled domStorageEnabled sharedCookiesEnabled thirdPartyCookiesEnabled startInLoadingState renderLoading={() => <View style={styles.loading}><ActivityIndicator color="#ef4444" /></View>} /> : null}</SafeAreaView></Modal>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [webUrl, setWebUrl] = useState('');

  useEffect(() => {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID, offlineAccess: false });
    const unsub = onAuthStateChanged(auth, current => { setUser(current); setAuthReady(true); });
    return unsub;
  }, []);

  const openWeb = (path = '/') => { setMenuOpen(false); setWebUrl(`${SITE_URL}${path}`); };

  async function handleGoogleSignIn() {
    setError('');
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();
      const idToken = result?.data?.idToken || result?.idToken;
      if (!idToken) throw new Error('Google sign-in did not return an ID token. Check Web Client ID and SHA fingerprints.');
      await signInToFirebaseWithGoogleIdToken(idToken);
    } catch (err) {
      if (err?.code === statusCodes.SIGN_IN_CANCELLED) return;
      setError(err?.message || 'Google sign-in failed.');
    }
  }

  async function handleSignOut() {
    setMenuOpen(false);
    try { await GoogleSignin.signOut(); } catch (e) {}
    await firebaseSignOut();
  }

  if (!authReady) return <SafeAreaView style={styles.safe}><View style={styles.loading}><ActivityIndicator color="#ef4444" /></View></SafeAreaView>;
  if (!user) return <AuthScreen onGoogle={handleGoogleSignIn} onEmail={() => setWebUrl(`${SITE_URL}/login`)} error={error} />;

  const Screen = tab === 'Calendar' ? Calendar : tab === 'Campaigns' ? Campaigns : tab === 'Characters' ? Characters : tab === 'Results' ? Results : Dashboard;
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" backgroundColor="#050505" /><Screen onMenu={() => setMenuOpen(true)} openWeb={openWeb} /><View style={styles.bottomNav}>{['Dashboard','Calendar','Campaigns','Characters','Results'].map(t=><Pressable key={t} style={styles.navItem} onPress={() => setTab(t)}><Text style={tab===t?styles.navIconActive:styles.navIcon}>{t === 'Dashboard' ? '⌂' : t === 'Calendar' ? '▣' : t === 'Campaigns' ? '◉' : t === 'Characters' ? '♙' : '▥'}</Text><Text style={tab===t?styles.navTextActive:styles.navText}>{t}</Text></Pressable>)}<Pressable style={styles.navItem} onPress={() => setMenuOpen(true)}><Text style={styles.navIcon}>•••</Text><Text style={styles.navText}>More</Text></Pressable></View><Menu visible={menuOpen} onClose={() => setMenuOpen(false)} openWeb={openWeb} onSignOut={handleSignOut} /><WebModal url={webUrl} onClose={() => setWebUrl('')} /></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#050505'},screen:{flex:1,backgroundColor:'#050505'},content:{padding:16,paddingBottom:96},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10},logoText:{fontSize:22,fontWeight:'900',color:'#f5d28a',lineHeight:20},screenTitle:{fontSize:24,fontWeight:'900',color:'#fff',marginTop:18},heroName:{fontSize:26,fontWeight:'900',color:'#fff',marginBottom:8},redText:{color:'#ef4444'},muted:{color:'#a1a1aa',fontSize:12},mutedSmall:{color:'#a1a1aa',fontSize:10},mutedCenter:{color:'#a1a1aa',textAlign:'center',fontSize:12,marginTop:8},gearButton:{width:42,height:42,borderRadius:10,borderWidth:1,borderColor:'#ef4444',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.55)'},gearText:{color:'#fff',fontSize:20},campaignSelector:{height:44,borderRadius:12,borderWidth:1,borderColor:'#2b2b2b',backgroundColor:'rgba(20,20,20,.9)',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,marginBottom:10},selectorText:{color:'#fff',fontWeight:'700'},selectorArrow:{color:'#ef4444',fontSize:20},statsGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},card:{backgroundColor:'rgba(15,15,15,.92)',borderWidth:1,borderColor:'#2b2b2b',borderRadius:14,padding:12,marginBottom:12},statCard:{width:'48%',minHeight:76},icon:{fontSize:20,fontWeight:'900',marginBottom:5},statValue:{color:'#fff',fontWeight:'900',fontSize:20},sectionTitle:{color:'#fff',fontSize:17,fontWeight:'900'},rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},rowCenter:{flexDirection:'row',alignItems:'center',gap:8},outlineButton:{borderColor:'#991b1b',borderWidth:1,borderRadius:8,paddingVertical:7,paddingHorizontal:10},outlineButtonText:{color:'#ef4444',fontSize:11,fontWeight:'700'},sessionRow:{flexDirection:'row',alignItems:'center',gap:12,marginTop:12},sessionRowCard:{backgroundColor:'rgba(15,15,15,.92)',borderWidth:1,borderColor:'#2b2b2b',borderRadius:14,padding:12,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12},datePill:{width:58,height:70,borderRadius:10,borderWidth:1,borderColor:'#242424',alignItems:'center',justifyContent:'center',backgroundColor:'#080808'},dateMonth:{color:'#ef4444',fontWeight:'900',fontSize:12},dateDay:{color:'#fff',fontWeight:'900',fontSize:22},dateDow:{color:'#fff',fontSize:11},cardTitle:{color:'#fff',fontWeight:'800',fontSize:14},chevron:{color:'#fff',fontSize:28},primaryButton:{height:42,borderRadius:9,backgroundColor:'#991b1b',alignItems:'center',justifyContent:'center',marginTop:12},primaryButtonText:{color:'#fff',fontWeight:'900'},weekRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:14},weekLabel:{color:'#a1a1aa',fontSize:10,width:34,textAlign:'center'},dayCircle:{width:34,height:34,alignItems:'center',justifyContent:'center'},activeDay:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',backgroundColor:'#991b1b'},dayText:{color:'#fff'},quickGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},quickCard:{width:'48%',backgroundColor:'rgba(15,15,15,.92)',borderWidth:1,borderColor:'#2b2b2b',borderRadius:12,padding:12},quickTitle:{color:'#fff',fontWeight:'800',fontSize:12},searchBox:{flex:1,height:44,borderRadius:10,backgroundColor:'#111',justifyContent:'center',paddingHorizontal:12,borderWidth:1,borderColor:'#242424'},smallRedButton:{height:44,borderRadius:10,backgroundColor:'#991b1b',justifyContent:'center',paddingHorizontal:14},smallRedButtonText:{color:'#fff',fontWeight:'900'},campaignCard:{flexDirection:'row',gap:12,backgroundColor:'rgba(15,15,15,.92)',borderWidth:1,borderColor:'#242424',borderRadius:13,padding:10,marginTop:10,alignItems:'center'},campaignImage:{width:72,height:88,borderRadius:8},activeBadge:{backgroundColor:'#991b1b',borderRadius:7,paddingHorizontal:7,paddingVertical:5},completeBadge:{backgroundColor:'#166534',borderRadius:7,paddingHorizontal:7,paddingVertical:5},badgeText:{color:'#fff',fontSize:10,fontWeight:'800'},monthGrid:{flexDirection:'row',flexWrap:'wrap',marginTop:10},monthLabel:{width:'14.28%',textAlign:'center',color:'#a1a1aa',fontSize:10,marginBottom:10},monthDay:{width:'14.28%',height:38,alignItems:'center',justifyContent:'center'},monthActive:{width:'14.28%',height:38,alignItems:'center',justifyContent:'center',backgroundColor:'#991b1b',borderRadius:19},floatingButton:{position:'absolute',right:22,bottom:105,width:58,height:58,borderRadius:29,backgroundColor:'#991b1b',alignItems:'center',justifyContent:'center'},floatingText:{fontSize:30,color:'#fff'},tabRow:{flexDirection:'row',gap:18,marginBottom:12},tabText:{color:'#a1a1aa',fontSize:12},activeTab:{color:'#ef4444',fontSize:12,borderBottomColor:'#ef4444',borderBottomWidth:2,paddingBottom:6},resultRow:{flexDirection:'row',alignItems:'center',gap:10,borderBottomWidth:1,borderBottomColor:'#222',paddingVertical:10},scoreBadge:{backgroundColor:'#14532d',borderRadius:7,paddingHorizontal:10,paddingVertical:5},scoreText:{color:'#86efac',fontWeight:'900'},pill:{color:'#fff',borderWidth:1,borderColor:'#333',borderRadius:8,paddingHorizontal:8,paddingVertical:5,fontSize:11},avatar:{width:58,height:58,borderRadius:29,backgroundColor:'#7f1d1d',alignItems:'center',justifyContent:'center'},avatarText:{color:'#fff',fontSize:24,fontWeight:'900'},modalBackdrop:{flex:1,backgroundColor:'rgba(0,0,0,.6)',justifyContent:'flex-end'},drawer:{maxHeight:'94%',backgroundColor:'#050505',borderTopLeftRadius:22,borderTopRightRadius:22,padding:16,borderWidth:1,borderColor:'#252525'},closeText:{fontSize:34,color:'#fff'},menuHeader:{color:'#fff',fontWeight:'900',fontSize:12,marginBottom:5},menuItem:{height:42,flexDirection:'row',alignItems:'center',gap:12},menuIcon:{width:24,color:'#ef4444',fontSize:16},menuText:{flex:1,color:'#fff',fontSize:14},version:{color:'#737373',fontSize:12,textAlign:'center',marginTop:4},bottomNav:{height:74,borderTopWidth:1,borderTopColor:'#181818',backgroundColor:'#050505',flexDirection:'row',alignItems:'center',justifyContent:'space-around'},navItem:{alignItems:'center',justifyContent:'center',flex:1},navIcon:{color:'#a1a1aa',fontSize:20},navIconActive:{color:'#ef4444',fontSize:20},navText:{color:'#a1a1aa',fontSize:10},navTextActive:{color:'#ef4444',fontSize:10},authWrap:{flex:1,justifyContent:'center',padding:26,alignItems:'center'},authLogo:{color:'#f5d28a',fontSize:36,fontWeight:'900',textAlign:'center',lineHeight:34,marginBottom:24},authTitle:{color:'#d4d4d8',fontSize:22,lineHeight:32,textAlign:'center',marginBottom:52},googleButton:{height:62,borderRadius:18,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',width:'100%',marginBottom:28},googleText:{fontSize:20,fontWeight:'900',color:'#111827'},emailLink:{color:'#93c5fd',fontSize:18,fontWeight:'800'},errorText:{color:'#fecaca',textAlign:'center',fontSize:16,lineHeight:22,marginTop:24},authFooter:{color:'#a1a1aa',fontSize:16,textAlign:'center',marginTop:50},webHeader:{height:54,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,borderBottomWidth:1,borderBottomColor:'#222'},webTitle:{color:'#fff',fontWeight:'900',fontSize:16},loading:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#050505'}
});
