import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  FlatList,
} from 'react-native';

// Sample Skills & Pre-loaded Demo Data
const SKILLS = [
  'Mason (Rajmistri)',
  'Electrician',
  'Painter',
  'Plumber',
  'Construction Helper',
  'Welder',
  'Commercial Driver',
  'Loader / Palledar',
  'Housemaid / Cleaner',
];

const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Need 2 Masons for Wall Plastering',
    category: 'Construction',
    requiredSkill: 'Mason (Rajmistri)',
    dailyRate: 850,
    address: 'Sector 62, Noida, UP',
    distanceKm: 2.4,
    status: 'OPEN',
    employerName: 'Sharma Construction Co.',
  },
  {
    id: 'job-2',
    title: 'House Painting - 3 BHK',
    category: 'Construction',
    requiredSkill: 'Painter',
    dailyRate: 750,
    address: 'Indirapuram, Ghaziabad',
    distanceKm: 4.1,
    status: 'OPEN',
    employerName: 'Rajesh Kumar (Home Owner)',
  },
  {
    id: 'job-3',
    title: 'Warehouse Loading & Packing',
    category: 'Warehouse',
    requiredSkill: 'Loader / Palledar',
    dailyRate: 650,
    address: 'Okhla Phase 3, New Delhi',
    distanceKm: 6.8,
    status: 'OPEN',
    employerName: 'Metro Logistics Ltd.',
  },
];

const WORKERS_LIST = [
  {
    id: 'w-1',
    name: 'Ramesh Verma',
    skill: 'Mason (Rajmistri)',
    experience: '6 Years',
    dailyRate: 850,
    rating: 4.8,
    distanceKm: 1.2,
    phone: '+91 9876543210',
    isOnline: true,
  },
  {
    id: 'w-2',
    name: 'Suresh Kumar',
    skill: 'Electrician',
    experience: '4 Years',
    dailyRate: 900,
    rating: 4.9,
    distanceKm: 2.5,
    phone: '+91 9812345678',
    isOnline: true,
  },
  {
    id: 'w-3',
    name: 'Manoj Singh',
    skill: 'Painter',
    experience: '5 Years',
    dailyRate: 750,
    rating: 4.7,
    distanceKm: 3.0,
    phone: '+91 9711223344',
    isOnline: false,
  },
];

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // App state
  const [role, setRole] = useState<'WORKER' | 'EMPLOYER'>('WORKER');
  const [activeTab, setActiveTab] = useState<'HOME' | 'JOBS' | 'WORKERS' | 'EARNINGS'>('HOME');
  const [isOnline, setIsOnline] = useState(true);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [myEarnings, setMyEarnings] = useState(1700);
  const [myJobsCompleted, setMyJobsCompleted] = useState(2);

  // Post Job modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobSkill, setNewJobSkill] = useState(SKILLS[0]);
  const [newJobRate, setNewJobRate] = useState('800');
  const [newJobAddress, setNewJobAddress] = useState('Sector 18, Noida');

  const handleSendOtp = () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    Alert.alert('OTP Sent', 'Demo OTP is: 123456');
  };

  const handleVerifyOtp = () => {
    if (otp === '123456' || otp.length === 6) {
      setIsAuthenticated(true);
    } else {
      Alert.alert('Invalid OTP', 'Please enter 123456 for demo login.');
    }
  };

  const handlePostJob = () => {
    if (!newJobTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a job title');
      return;
    }
    const newJob = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      category: 'Construction',
      requiredSkill: newJobSkill,
      dailyRate: parseInt(newJobRate) || 800,
      address: newJobAddress,
      distanceKm: 1.5,
      status: 'OPEN',
      employerName: 'My Business / Enterprise',
    };
    setJobs([newJob, ...jobs]);
    setShowPostModal(false);
    setNewJobTitle('');
    Alert.alert('Success 🎉', 'Job posted! Nearby workers have been notified.');
  };

  const handleAcceptJob = (jobTitle: string) => {
    Alert.alert('Job Accepted! 👷', `You accepted "${jobTitle}". Employer details have been shared with you.`);
    setMyJobsCompleted((prev) => prev + 1);
    setMyEarnings((prev) => prev + 800);
  };

  const handleHireWorker = (workerName: string) => {
    Alert.alert('Worker Hired! 🤝', `You successfully hired ${workerName}. We have sent them the job location & contact details.`);
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.brandHeader}>
          <Text style={styles.brandTitle}>Kaamorax</Text>
          <Text style={styles.brandTagline}>Connecting Work with Workforce</Text>
        </View>

        <View style={styles.authCard}>
          <Text style={styles.authHeading}>Welcome to Kaamorax</Text>
          <Text style={styles.authSub}>India's Instant Blue-Collar Workforce App</Text>

          {/* Role selector before login */}
          <View style={styles.roleToggleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'WORKER' && styles.roleBtnActive]}
              onPress={() => setRole('WORKER')}
            >
              <Text style={[styles.roleBtnText, role === 'WORKER' && styles.roleBtnTextActive]}>
                👷 Worker Mode
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'EMPLOYER' && styles.roleBtnActive]}
              onPress={() => setRole('EMPLOYER')}
            >
              <Text style={[styles.roleBtnText, role === 'EMPLOYER' && styles.roleBtnTextActive]}>
                🏗️ Employer Mode
              </Text>
            </TouchableOpacity>
          </View>

          {!otpSent ? (
            <>
              <Text style={styles.inputLabel}>Mobile Number (+91)</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp}>
                <Text style={styles.primaryBtnText}>Get OTP Code</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Enter 6-Digit OTP (Demo: 123456)</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp}>
                <Text style={styles.primaryBtnText}>Verify & Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.linkBtn}>
                <Text style={styles.linkText}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // --- MAIN APP SCREEN ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* App Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topTitle}>Kaamorax</Text>
          <Text style={styles.topSubtitle}>
            {role === 'WORKER' ? '👷 Worker Dashboard' : '🏗️ Employer Portal'}
          </Text>
        </View>

        {/* Mode Switcher */}
        <TouchableOpacity
          style={styles.modeSwitchBadge}
          onPress={() => setRole(role === 'WORKER' ? 'EMPLOYER' : 'WORKER')}
        >
          <Text style={styles.modeSwitchText}>
            Switch to {role === 'WORKER' ? 'Employer' : 'Worker'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.scrollContent}>
        {/* WORKER DASHBOARD VIEW */}
        {role === 'WORKER' ? (
          <View style={styles.contentPadding}>
            {/* Availability Status Card */}
            <View style={[styles.statusCard, isOnline ? styles.bgGreen : styles.bgGray]}>
              <View>
                <Text style={styles.statusTitle}>
                  {isOnline ? '🟢 Online (Receiving Jobs)' : '⚪ Offline'}
                </Text>
                <Text style={styles.statusDesc}>
                  {isOnline
                    ? 'Nearby employers can see your profile & hire you'
                    : 'Turn on to receive instant job alerts in Noida'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setIsOnline(!isOnline)}
              >
                <Text style={styles.toggleBtnText}>{isOnline ? 'GO OFFLINE' : 'GO ONLINE'}</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>₹{myEarnings}</Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{myJobsCompleted}</Text>
                <Text style={styles.statLabel}>Jobs Completed</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>4.9 ★</Text>
                <Text style={styles.statLabel}>My Rating</Text>
              </View>
            </View>

            {/* Live Job Feed Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚡ Nearby Available Jobs (Within 10 KM)</Text>
            </View>

            {jobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobBadgeRow}>
                  <Text style={styles.jobCategoryBadge}>{job.category}</Text>
                  <Text style={styles.jobDistanceText}>📍 {job.distanceKm} km away</Text>
                </View>

                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobSkillReq}>Required: {job.requiredSkill}</Text>
                <Text style={styles.jobAddress}>📍 {job.address}</Text>

                <View style={styles.jobFooter}>
                  <Text style={styles.jobRate}>₹{job.dailyRate} / day</Text>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAcceptJob(job.title)}
                  >
                    <Text style={styles.acceptBtnText}>Accept Job ⚡</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* EMPLOYER DASHBOARD VIEW */
          <View style={styles.contentPadding}>
            {/* Post Job CTA Banner */}
            <View style={styles.postJobBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Need Daily Labour or Skilled Worker?</Text>
                <Text style={styles.bannerSub}>Hire verified workers nearby in 2 minutes</Text>
              </View>
              <TouchableOpacity
                style={styles.postBtn}
                onPress={() => setShowPostModal(true)}
              >
                <Text style={styles.postBtnText}>+ Post Job</Text>
              </TouchableOpacity>
            </View>

            {/* Nearby Verified Workers */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👨‍🏭 Verified Workers Nearby</Text>
            </View>

            {WORKERS_LIST.map((worker) => (
              <View key={worker.id} style={styles.workerCard}>
                <View style={styles.workerHeader}>
                  <View>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerSkill}>{worker.skill} • {worker.experience}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>★ {worker.rating}</Text>
                  </View>
                </View>

                <View style={styles.workerSubInfo}>
                  <Text style={styles.infoText}>📍 {worker.distanceKm} km away</Text>
                  <Text style={styles.rateText}>₹{worker.dailyRate} / day</Text>
                </View>

                <TouchableOpacity
                  style={styles.hireBtn}
                  onPress={() => handleHireWorker(worker.name)}
                >
                  <Text style={styles.hireBtnText}>Hire Worker Instantly 🤝</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* POST JOB MODAL */}
      <Modal visible={showPostModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post New Job Opening 🏗️</Text>

            <Text style={styles.inputLabel}>Job Requirement Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Need 3 Electricians for Building Wiring"
              value={newJobTitle}
              onChangeText={setNewJobTitle}
            />

            <Text style={styles.inputLabel}>Required Skill</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
              {SKILLS.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.chip,
                    newJobSkill === skill && styles.chipSelected,
                  ]}
                  onPress={() => setNewJobSkill(skill)}
                >
                  <Text style={[styles.chipText, newJobSkill === skill && styles.chipTextSelected]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Daily Rate (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={newJobRate}
              onChangeText={setNewJobRate}
            />

            <Text style={styles.inputLabel}>Work Address</Text>
            <TextInput
              style={styles.input}
              value={newJobAddress}
              onChangeText={setNewJobAddress}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowPostModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitJobBtn} onPress={handlePostJob}>
                <Text style={styles.submitJobText}>Publish & Match 🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    padding: 20,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  authHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  authSub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  roleToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: '#0EA5E9',
  },
  roleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  linkBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  linkText: {
    color: '#0EA5E9',
    fontSize: 14,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0EA5E9',
  },
  topSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  modeSwitchBadge: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modeSwitchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  scrollContent: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bgGreen: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  bgGray: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15803D',
  },
  statusDesc: {
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
    maxWidth: 220,
  },
  toggleBtn: {
    backgroundColor: '#15803D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  jobBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobCategoryBadge: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobDistanceText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  jobSkillReq: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0EA5E9',
    marginTop: 4,
  },
  jobAddress: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  jobRate: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  postJobBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  postBtn: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  postBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  workerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  workerSkill: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#D97706',
    fontWeight: '800',
    fontSize: 12,
  },
  workerSubInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
  },
  rateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16A34A',
  },
  hireBtn: {
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  hireBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#0EA5E9',
  },
  chipText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
  },
  submitJobBtn: {
    flex: 2,
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitJobText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
