import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const formatRupiah = (angka) => {
  const abs = Math.abs(angka);
  return 'Rp ' + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export default function App() {
  const [transaksi, setTransaksi] = useState([
    { id: '1', ket: 'Uang Saku Bulan Ini', nominal: 1500000, tipe: 'masuk' },
    { id: '2', ket: 'Beli Makan Siang', nominal: 25000, tipe: 'keluar' },
    { id: '3', ket: 'Bayar Kost', nominal: 500000, tipe: 'keluar' },
  ]);

  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');

  const totalSaldo = transaksi.reduce((acc, item) => {
    return item.tipe === 'masuk' ? acc + item.nominal : acc - item.nominal;
  }, 0);

  const totalMasuk = transaksi
    .filter((t) => t.tipe === 'masuk')
    .reduce((acc, t) => acc + t.nominal, 0);

  const totalKeluar = transaksi
    .filter((t) => t.tipe === 'keluar')
    .reduce((acc, t) => acc + t.nominal, 0);

  const tambahTransaksi = (tipe) => {
    const trimDesc = deskripsi.trim();
    const nominalAngka = parseInt(nominal.replace(/\D/g, ''), 10);

    if (!trimDesc) {
      Alert.alert('Oops!', 'Deskripsi tidak boleh kosong.');
      return;
    }
    if (!nominalAngka || nominalAngka <= 0) {
      Alert.alert('Oops!', 'Masukkan nominal yang valid.');
      return;
    }

    const baru = {
      id: generateId(),
      ket: trimDesc,
      nominal: nominalAngka,
      tipe,
    };

    setTransaksi([baru, ...transaksi]);
    setDeskripsi('');
    setNominal('');
  };

  const hapusTransaksi = (id) => {
    Alert.alert('Hapus Transaksi', 'Yakin ingin menghapus transaksi ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => setTransaksi(transaksi.filter((t) => t.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.transactionCard, index === 0 && styles.transactionCardFirst]}
      onLongPress={() => hapusTransaksi(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.tipeIndicator, item.tipe === 'masuk' ? styles.indicatorMasuk : styles.indicatorKeluar]} />
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionKet} numberOfLines={1}>
          {item.ket}
        </Text>
        <Text style={styles.transactionTipe}>
          {item.tipe === 'masuk' ? '↑ Pemasukan' : '↓ Pengeluaran'}
        </Text>
      </View>
      <Text style={[styles.transactionNominal, item.tipe === 'masuk' ? styles.nominalMasuk : styles.nominalKeluar]}>
        {item.tipe === 'masuk' ? '+' : '-'}{formatRupiah(item.nominal)}
      </Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      {/* HEADER SALDO */}
      <View style={styles.saldoContainer}>
        <Text style={styles.saldoLabel}>Total Saldo</Text>
        <Text style={[styles.saldoAngka, totalSaldo < 0 && styles.saldoNegatif]}>
          {totalSaldo < 0 ? '-' : ''}{formatRupiah(totalSaldo)}
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>📈 Pemasukan</Text>
            <Text style={[styles.summaryAngka, styles.nominalMasuk]}>{formatRupiah(totalMasuk)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>📉 Pengeluaran</Text>
            <Text style={[styles.summaryAngka, styles.nominalKeluar]}>{formatRupiah(totalKeluar)}</Text>
          </View>
        </View>
      </View>

      {/* FORM INPUT */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Tambah Transaksi</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Deskripsi</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Beli Makan, Uang Bulanan..."
            placeholderTextColor="#9CA3AF"
            value={deskripsi}
            onChangeText={setDeskripsi}
            maxLength={50}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Nominal (Rp)</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 50000"
            placeholderTextColor="#9CA3AF"
            value={nominal}
            onChangeText={setNominal}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonMasuk]}
            onPress={() => tambahTransaksi('masuk')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>+ Pemasukan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonKeluar]}
            onPress={() => tambahTransaksi('keluar')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>- Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST HEADER */}
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Riwayat Transaksi</Text>
        <Text style={styles.historyCount}>{transaksi.length} transaksi</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <Text style={styles.appTitle}>💰 Dompet Ku</Text>
          <Text style={styles.appSubtitle}>Expense Tracker</Text>
        </View>

        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🧾</Text>
              <Text style={styles.emptyText}>Belum ada transaksi</Text>
              <Text style={styles.emptySubtext}>Tambahkan transaksi pertama kamu!</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  topBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // SALDO
  saldoContainer: {
    backgroundColor: '#0F172A',
    marginHorizontal: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  saldoLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  saldoAngka: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 20,
  },
  saldoNegatif: {
    color: '#F87171',
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryAngka: {
    fontSize: 15,
    fontWeight: '700',
  },

  // FORM
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMasuk: {
    backgroundColor: '#059669',
  },
  buttonKeluar: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // HISTORY
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyCount: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // TRANSACTION CARD
  transactionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionCardFirst: {
    borderWidth: 0,
  },
  tipeIndicator: {
    width: 5,
    alignSelf: 'stretch',
  },
  indicatorMasuk: {
    backgroundColor: '#059669',
  },
  indicatorKeluar: {
    backgroundColor: '#DC2626',
  },
  transactionInfo: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 14,
  },
  transactionKet: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 3,
  },
  transactionTipe: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  transactionNominal: {
    fontSize: 14,
    fontWeight: '700',
    paddingRight: 16,
    paddingLeft: 8,
  },
  nominalMasuk: {
    color: '#059669',
  },
  nominalKeluar: {
    color: '#DC2626',
  },

  // EMPTY
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94A3B8',
  },

  listContent: {
    paddingBottom: 30,
  },
});