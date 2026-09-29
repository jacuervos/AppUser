import {StyleSheet} from 'react-native';
import {colors, fontFamily} from '../../utils/constants';

const IncentivesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 120,
  },
  screenTitle: {
    fontSize: 28,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
  },
  screenSubtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  currentCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
  },
  currentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currentLabel: {
    fontSize: 13,
    fontFamily: fontFamily.fontFamilyMedium,
    color: 'rgba(255,255,255,0.8)',
  },
  currentName: {
    marginTop: 4,
    fontSize: 24,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
  },
  currentPoints: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  progressHint: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  track: {
    width: 36,
    alignItems: 'center',
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotUnlocked: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.lightGreen,
  },
  dotCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    minHeight: 16,
  },
  lineUnlocked: {
    backgroundColor: colors.lightGreen,
  },
  levelCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginLeft: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelCardCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  levelCardLocked: {
    backgroundColor: colors.background,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelName: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.text,
    marginRight: 8,
  },
  levelNameLocked: {
    color: colors.gray,
  },
  levelRange: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  hereBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hereBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
  },
  nextBadge: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nextBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.primary,
  },
});

export default IncentivesStyles;
