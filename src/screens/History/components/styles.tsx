import {StyleSheet} from 'react-native';
import {colors, fontFamily} from '../../../utils/constants';

const CardHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Pestañas
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.text,
  },
  activeTabText: {
    color: colors.white,
  },

  // Contenido
  content: {
    flex: 1,
    paddingTop: 15,
  },
  listContainer: {
    paddingHorizontal: 15,
  },

  // Cards de órdenes
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  orderContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderFecha: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    marginBottom: 5,
  },
  orderNombre: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginBottom: 5,
  },
  orderTelefono: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.text,
    marginBottom: 8,
  },
  orderEstado: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  orderEstadoText: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
  },

  // Cards de incentivos
  incentiveCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  incentiveImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  incentiveContent: {
    flex: 1,
    justifyContent: 'center',
  },
  incentiveFecha: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginBottom: 10,
  },
  incentiveEstado: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  incentiveEstadoText: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
  },
});

export default CardHistoryStyles;