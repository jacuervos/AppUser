
import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Alert, Text, TouchableOpacity} from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('../../src/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => {
    const React = require('react');
    const {View} = require('react-native');

    return {
        __esModule: true,
        default: ({children}: any) =>
            React.createElement(View, null, children),
    };
});

jest.mock('react-native-paper', () => {
    const React = require('react');
    const {Text} = require('react-native');

    return {
        ActivityIndicator: () =>
            React.createElement(Text, null, 'Cargando'),
    };
});

jest.mock('../../src/services/pushNotificationService', () => ({
    __esModule: true,
    default: {
        requestPermission: jest.fn(),
        getToken: jest.fn(),
        onMessage: jest.fn(),
        onNotificationOpenedApp: jest.fn(),
        getInitialNotification: jest.fn(),
        registerDevice: jest.fn(),
        setupNotifications: jest.fn(),
    },
}));

jest.mock('../../src/components/textInput/PrincipalTextInput.tsx', () => {
    const React = require('react');
    const {TextInput} = require('react-native');

    return {
        PrincipalTextInput: ({value, valueChange, change, label}: any) =>
            React.createElement(TextInput, {
                testID: valueChange,
                value,
                placeholder: label,
                onChangeText: (text: string) => change(valueChange, text),
            }),
    };
});

jest.mock('../../src/components/buttons/PrimaryButton.tsx', () => {
    const React = require('react');
    const {TouchableOpacity, Text} = require('react-native');

    return {
        PrimaryButton: ({text, action, disabled}: any) =>
            React.createElement(
                TouchableOpacity,
                {
                    testID: 'login-button',
                    disabled,
                    onPress: action,
                },
                React.createElement(Text, null, text),
            ),
    };
});

import InitView from '../../src/screens/InitView/InitView';
import {useAuth} from '../../src/hooks/useAuth';
import {useNavigation} from '@react-navigation/native';

describe('InitView', () => {
    const login = jest.fn();
    const clearError = jest.fn();
    const navigate = jest.fn();
    const replace = jest.fn();

    const renderView = async () => {
        let component!: TestRenderer.ReactTestRenderer;

        await act(async () => {
            component = TestRenderer.create(<InitView />);
        });

        return component;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useAuth as jest.Mock).mockReturnValue({
            login,
            isLoading: false,
            error: null,
            isAuthenticated: false,
            isInitialized: true,
            clearError,
        });

        (useNavigation as jest.Mock).mockReturnValue({
            navigate,
            replace,
        });
    });

    it('muestra el indicador mientras se inicializa la sesión', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            login,
            isLoading: false,
            error: null,
            isAuthenticated: false,
            isInitialized: false,
            clearError,
        });

        const component = await renderView();

        expect(
            component.root.findAllByType(Text).some(
                node => node.props.children === 'Verificando sesión...',
            ),
        ).toBe(true);

        expect(
            component.root.findAllByProps({testID: 'login-button'}),
        ).toHaveLength(0);

        act(() => {
            component.unmount();
        });
    });

    it('redirige a Tab si la sesión ya está autenticada', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            login,
            isLoading: false,
            error: null,
            isAuthenticated: true,
            isInitialized: true,
            clearError,
        });

        const component = await renderView();

        expect(replace).toHaveBeenCalledWith('Tab');

        act(() => {
            component.unmount();
        });
    });

    it('muestra el formulario cuando no hay una sesión autenticada', async () => {
        const component = await renderView();

        expect(
            component.root.findByProps({testID: 'email'}),
        ).toBeTruthy();

        expect(
            component.root.findByProps({testID: 'password'}),
        ).toBeTruthy();

        expect(
            component.root.findByProps({testID: 'login-button'}),
        ).toBeTruthy();

        act(() => {
            component.unmount();
        });
    });

    it('navega a la pantalla de recuperación de contraseña', async () => {
        const component = await renderView();

        const forgotButton = component.root.find(
            node =>
                node.type === TouchableOpacity &&
                node.findAllByType(Text).some(
                    textNode =>
                        textNode.props.children === '¿Olvidaste tu contraseña?',
                ),
        );

        act(() => {
            forgotButton.props.onPress();
        });

        expect(navigate).toHaveBeenCalledWith('ForgotPassword');

        act(() => {
            component.unmount();
        });
    });

    it('navega a Register al pulsar Registrarse', async () => {
        const component = await renderView();

        const registerButton = component.root.find(
            node =>
                node.type === TouchableOpacity &&
                node.findAllByType(Text).some(
                    textNode => textNode.props.children === 'Registrarse',
                ),
        );

        act(() => {
            registerButton.props.onPress();
        });

        expect(navigate).toHaveBeenCalledWith('Register');

        act(() => {
            component.unmount();
        });
    });

    it('limpia los errores e inicia sesión con las credenciales ingresadas', async () => {
        login.mockResolvedValueOnce(undefined);

        const component = await renderView();

        act(() => {
            component.root
                .findByProps({testID: 'email'})
                .props.onChangeText('carlos@example.com');

            component.root
                .findByProps({testID: 'password'})
                .props.onChangeText('secret123');
        });

        await act(async () => {
            component.root.findByProps({testID: 'login-button'}).props.onPress();
        });

        expect(clearError).toHaveBeenCalled();

        expect(login).toHaveBeenCalledWith({
            email: 'carlos@example.com',
            password: 'secret123',
        });

        expect(replace).toHaveBeenCalledWith('Tab');

        act(() => {
            component.unmount();
        });
    });

    it('muestra una alerta si el inicio de sesión falla con un Error', async () => {
        login.mockRejectedValueOnce(new Error('Credenciales inválidas'));

        const alertSpy = jest.spyOn(Alert, 'alert');

        const component = await renderView();

        act(() => {
            component.root
                .findByProps({testID: 'email'})
                .props.onChangeText('carlos@example.com');

            component.root
                .findByProps({testID: 'password'})
                .props.onChangeText('secret123');
        });

        await act(async () => {
            component.root.findByProps({testID: 'login-button'}).props.onPress();
        });

        expect(alertSpy).toHaveBeenCalledWith(
            'Error de autenticación',
            'Credenciales inválidas',
        );

        expect(replace).not.toHaveBeenCalled();

        alertSpy.mockRestore();

        act(() => {
            component.unmount();
        });
    });

    it('muestra el error genérico cuando el rechazo no es una instancia de Error', async () => {
        login.mockRejectedValueOnce('error desconocido');

        const alertSpy = jest.spyOn(Alert, 'alert');

        const component = await renderView();

        act(() => {
            component.root
                .findByProps({testID: 'email'})
                .props.onChangeText('carlos@example.com');

            component.root
                .findByProps({testID: 'password'})
                .props.onChangeText('secret123');
        });

        await act(async () => {
            component.root.findByProps({testID: 'login-button'}).props.onPress();
        });

        expect(alertSpy).toHaveBeenCalledWith(
            'Error de autenticación',
            'Error al iniciar sesión',
        );

        alertSpy.mockRestore();

        act(() => {
            component.unmount();
        });
    });

    it('muestra Iniciando... mientras isLoading es true', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            login,
            isLoading: true,
            error: null,
            isAuthenticated: false,
            isInitialized: true,
            clearError,
        });

        const component = await renderView();

        const button = component.root.findByProps({
            testID: 'login-button',
        });

        expect(button.findByType(Text).props.children).toBe('Iniciando sesión...'.replace(' sesión...', '...'));

        act(() => {
            component.unmount();
        });
    });

    it('muestra el error devuelto por useAuth en el formulario', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            login,
            isLoading: false,
            error: 'No fue posible iniciar sesión',
            isAuthenticated: false,
            isInitialized: true,
            clearError,
        });

        const component = await renderView();

        expect(
            component.root.findAllByType(Text).some(
                node => node.props.children === 'No fue posible iniciar sesión',
            ),
        ).toBe(true);

        act(() => {
            component.unmount();
        });
    });
});
