export const colors = {
    // Verde principal más vibrante para reciclaje
    primary: '#2E7D32',
    // Verde claro para fondos y elementos secundarios
    secondary: '#E8F5E8',
    // Verde oscuro para textos y elementos destacados
    accent: '#1B5E20',
    // Verde agua para elementos interactivos
    tertiary: '#4CAF50',
    // Color de texto principal
    text: '#2C2C2C',
    // Verde suave para botones secundarios
    lightGreen: '#81C784',
    // Error en tonos más suaves
    error: '#E57373',
    // Warning en tonos tierra
    warning: '#FF8A65',
    // Success con verde más brillante
    success: '#66BB6A',
    // Info con verde azulado
    info: '#26A69A',
    white: '#FFFFFF',
    black: '#1A1A1A',
    // Grises más cálidos
    gray: '#757575',
    lightGray: '#F5F5F5',
    darkGray: '#424242',
    // Fondo principal con tinte verde muy sutil
    background: '#FAFFFE',
    border: '#f0f0f0',
    textSecondary: '#757575'
}

// Estilos reutilizables para sombras
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    small: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    medium: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    large: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
}

// Radios de borde comunes
export const borderRadius = {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    round: 50,
}

export const fontFamily = {
    fontFamilyBlack:'Nunito-Black',
    fontFamilyBlackItalic:'Nunito-BlackItalic',
    fontFamilyBold:'Nunito-Bold',
    fontFamilyBoldItalic:'Nunito-BoldItalic', 
    fontFamilyItalic:'Nunito-Italic', 
    fontFamilyLight:'Nunito-Light',
    fontFamilyLightItalic:'Nunito-LightItalic', 
    fontFamilyMedium:'Nunito-Medium',
    fontFamilyMediumItalic:'Nunito-MediumItalic', 
    fontFamilyRegular:'Nunito-Regular',
    fontFamilySemiBold:'Nunito-SemiBold',
    fontFamilySemiBoldItalic:'Nunito-SemiBoldItalic',
}
