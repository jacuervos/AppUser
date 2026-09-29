import {StyleSheet} from 'react-native';
import {colors, fontFamily} from '../../utils/constants';

const orderDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginRight: 40,
  },
  hero: {
    marginTop: 8,
    marginBottom: 24,
  },
  orderId: {
    fontSize: 28,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
    letterSpacing: 0.4,
  },
  dateText: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyMedium,
    color: colors.gray,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.gray,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  rowIcon: {
    width: 22,
    marginTop: 2,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.text,
    lineHeight: 22,
  },
  muted: {
    fontSize: 15,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  materialName: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyMedium,
    color: colors.text,
    marginRight: 12,
  },
  materialMeta: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  materialPoints: {
    minWidth: 64,
    textAlign: 'right',
    fontSize: 14,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.primary,
  },
  summary: {
    flexDirection: 'row',
    marginTop: 8,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
  },
});

export default orderDetailStyles;
