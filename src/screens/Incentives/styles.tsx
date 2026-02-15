import {StyleSheet} from 'react-native';
import {colors, fontFamily} from '../../utils/constants';

const IncentivesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Content styles - improved margins and spacing
  content: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24, // Increased horizontal padding
    paddingTop: 24, // Added top padding
    paddingBottom: 120, // Increased bottom padding for navigation space
  },

  // Incentives section - improved spacing
  incentivesSection: {
    flex: 1,
  },
  
  sectionTitle: {
    fontSize: 22, // Slightly larger title
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.black,
    marginBottom: 20, // Increased margin
    marginTop: 8, // Added top margin
  },

  // Incentive card styles - improved margins and layout
  incentiveCard: {
    backgroundColor: colors.white,
    borderRadius: 16, // Increased border radius
    padding: 20, // Increased padding
    marginBottom: 16, // Increased margin between cards
    marginHorizontal: 4, // Added horizontal margin for better visual separation
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15, // Softer shadow
    shadowRadius: 4, // Larger shadow radius
  },
  
  incentiveCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#f8f8f8',
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Increased margin
  },
  
  categoryIcon: {
    width: 36, // Slightly larger icon container
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // Increased margin
  },
  
  cardTitleContainer: {
    flex: 1,
    marginRight: 12, // Added margin to separate from points
  },
  
  incentiveTitle: {
    fontSize: 17, // Slightly larger title
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.black,
    lineHeight: 22, // Added line height for better readability
  },
  
  categoryText: {
    fontSize: 13, // Slightly larger category text
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    marginTop: 4, // Increased margin
  },
  
  pointsContainer: {
    alignItems: 'center',
    minWidth: 50, // Ensure consistent width
  },
  
  pointsText: {
    fontSize: 19, // Slightly larger points
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.primary,
  },
  
  pointsLabel: {
    fontSize: 11, // Slightly larger label
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    marginTop: 2,
  },
  
  incentiveDescription: {
    fontSize: 15, // Larger description text
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.darkGray,
    lineHeight: 22, // Improved line height
    marginTop: 4, // Added margin from header
  },
  
  textDisabled: {
    color: colors.gray,
  },

  // Unavailable overlay - improved positioning
  unavailableOverlay: {
    position: 'absolute',
    top: 12, // Adjusted position
    right: 12,
    backgroundColor: colors.gray,
    paddingHorizontal: 10, // Increased padding
    paddingVertical: 6,
    borderRadius: 12, // Fully rounded corners
  },
  
  unavailableText: {
    fontSize: 10,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
    textTransform: 'uppercase',
  },

  // Bottom navigation - improved spacing and layout
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingTop: 16, // Increased top padding
    paddingBottom: 34, // Increased bottom padding for safe area
    paddingHorizontal: 16, // Increased horizontal padding
    borderTopLeftRadius: 24, // Larger border radius
    borderTopRightRadius: 24,
    elevation: 12, // Increased elevation
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3, // Stronger shadow
    },
    shadowOpacity: 0.15, // Softer shadow
    shadowRadius: 10, // Larger shadow radius
  },
  
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10, // Increased vertical padding
    paddingHorizontal: 8, // Increased horizontal padding
    borderRadius: 14, // Increased border radius
    marginHorizontal: 2, // Added margin between buttons
  },
  
  navButtonActive: {
    backgroundColor: colors.primary,
  },
  
  navButtonText: {
    fontSize: 11, // Slightly larger text
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.primary,
    marginTop: 6, // Increased margin
    textAlign: 'center',
    lineHeight: 14, // Added line height
  },
  
  navButtonTextActive: {
    color: colors.white,
    fontFamily: fontFamily.fontFamilySemiBold,
  },

  // Header styles (if needed for future use)
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24, // Consistent with content padding
  },
  
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  headerTitle: {
    fontSize: 24,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
  },
  
  // User info styles (if needed for future use)
  userInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  
  timeText: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.white,
    opacity: 0.9,
  },
  
  nameText: {
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
    marginTop: 4,
  },
  
  phoneText: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  
  statusText: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
    marginTop: 4,
    opacity: 0.8,
  },
});

export default IncentivesStyles;
