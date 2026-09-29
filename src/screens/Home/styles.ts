import {StyleSheet} from 'react-native';
import {colors, fontFamily} from '../../utils/constants';

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // App Header styles
  appHeader: {
    backgroundColor: colors.white,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appLogo: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  appTitle: {
    fontSize: 24,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.primary,
  },
  appSubtitle: {
    fontSize: 24,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.black,
    marginLeft: 2,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTime: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  headerWelcome: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.black,
  },

  // Content styles with improved margins
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100, // Space for bottom navigation
  },

  // Incentives grid with improved margins
  incentivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 28,
    paddingHorizontal: 2,
  },
  incentiveCard: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.black,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 10,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 4,
  },

  // Top incentives banner
  topIncentivesBanner: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerGradient: {
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
  },
  bannerSubtitle: {
    fontSize: 11,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },

  // Redirect note
  redirectNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 100, // Espacio para la navegación inferior
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  redirectText: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.darkGray,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  // Bottom navigation
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingTop: 12,
    paddingBottom: 30, // Espacio adicional para dispositivos con notch
    paddingHorizontal: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  navButtonActive: {
    backgroundColor: colors.primary,
  },
  navButtonText: {
    fontSize: 10,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  navButtonTextActive: {
    color: colors.white,
    fontFamily: fontFamily.fontFamilySemiBold,
  },

  // New sections styles with improved margins
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.black,
    marginLeft: 8,
  },

  // Órdenes en curso styles with improved margins
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    marginHorizontal: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOrder: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    width: '40%',
    marginTop: 10
  },
  orderStatusText: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
    textAlign: 'center',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderLocation: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    marginLeft: 6,
  },
  orderDetails: {
    marginTop: 4,
  },
  orderMaterials: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.black,
    marginBottom: 8,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTime: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.primary,
  },
  orderPoints: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.primary,
  },

  // Top incentives styles
  horizontalScroll: {
    marginTop: 10,
  },
  topIncentiveCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,
  },
  incentiveRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankNumber: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
  },
  topIncentiveTitle: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  topIncentivePoints: {
    fontSize: 11,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.primary,
    marginBottom: 2,
  },
  topIncentiveCategory: {
    fontSize: 10,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },

  // Blog styles with improved margins
  blogCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    marginHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },
  blogIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  blogContent: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.black,
    marginBottom: 4,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blogAuthor: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  blogDate: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },

  // Tips styles with improved margins
  tipCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    marginHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.black,
    lineHeight: 20,
  },
  tipCategory: {
    fontSize: 11,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.secondary,
    textTransform: 'uppercase',
  },
});

export default homeStyles;
