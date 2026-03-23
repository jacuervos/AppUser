import {StyleSheet} from 'react-native';
import {colors, fontFamily} from '../../utils/constants.tsx';

const ProfileStyles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerCamera: {
    backgroundColor: colors.white,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
    position: 'absolute',
    top: '57%',
    right: '38%',
  },
  containerImage: {
    backgroundColor: colors.white,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerButton: {
    alignItems: 'center',
    marginLeft: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    justifyContent: 'center',
    top: 10,
    zIndex: 100,
    width: 40,
    height: 40,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  containerTitle: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  firstTitle: {
    color: colors.primary,
    fontSize: 25,
    fontFamily: fontFamily.fontFamilyBold,
  },
  textInput: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    marginTop: '5%',
    fontFamily: fontFamily.fontFamilyRegular,
  },
  containerButton: {
    marginTop: '15%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  gradientStyles: {
    height: '25%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderColor: '#fcc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 15,
    alignSelf: 'center',
    width: '90%',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    textAlign: 'center',
  },
});

export default ProfileStyles;
