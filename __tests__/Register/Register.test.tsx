import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Text, TouchableOpacity, Pressable} from 'react-native';

import Register from '../../src/screens/Register/Register';
import {useAuth} from '../../src/hooks/useAuth';
import useTypeIdentificationStore from '../../src/store/typeIdentificationStore';
import {openCamera, openGallery} from '../../src/functions/Camera';

const mockNavigateReplace = jest.fn();
const mockGoBack = jest.fn();
const mockRegister = jest.fn();
const mockClearError = jest.fn();
const mockGetTypeIdentifications = jest.fn();
const mockPresent = jest.fn();
const mockDismiss = jest.fn();

// Permite elegir un ID válido o uno inexistente en pruebas específicas.
const mockSelectedTypeId = {current: '1'};

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        replace: mockNavigateReplace,
        goBack: mockGoBack,
    }),
}));

jest.mock('../../src/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../src/store/typeIdentificationStore', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../../src/functions/Camera', () => ({
    openCamera: jest.fn(),
    openGallery: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => {
    const React = require('react');
    const {View} = require('react-native');

    return ({children, ...props}: any) =>
        React.createElement(View, props, children);
});

jest.mock('react-native-vector-icons/MaterialIcons', () => {
    const React = require('react');
    const {Text} = require('react-native');

    return ({name}: any) => React.createElement(Text, null, name);
});

jest.mock('../../src/components/textInput/PrincipalTextInput', () => {
    const React = require('react');
    const {TextInput} = require('react-native');

    return {
        PrincipalTextInput: ({
                                 value,
                                 valueChange,
                                 change,
                                 label,
                             }: any) =>
            React.createElement(TextInput, {
                testID: `input-${valueChange}`,
                accessibilityLabel: label,
                value,
                onChangeText: (text: string) => change(valueChange, text),
            }),
    };
});

jest.mock('../../src/components/inputSelect/PrincipalInputSelect', () => {
    const React = require('react');
    const {TouchableOpacity, Text} = require('react-native');

    return {
        PrincipalInputSelect: ({valueChange, change, label}: any) =>
            React.createElement(
                TouchableOpacity,
                {
                    testID: 'select-identification',
                    onPress: () =>
                        change(valueChange, mockSelectedTypeId.current),
                },
                React.createElement(Text, null, label),
            ),
    };
});

jest.mock('../../src/components/buttons/PrimaryButton', () => {
    const React = require('react');
    const {TouchableOpacity, Text} = require('react-native');

    return {
        PrimaryButton: ({text, action, disabled}: any) =>
            React.createElement(
                TouchableOpacity,
                {
                    testID: 'register-button',
                    onPress: action,
                    disabled,
                },
                React.createElement(Text, null, text),
            ),
    };
});

jest.mock('../../src/components/modals/ChangeImage', () => {
    const React = require('react');
    const {TouchableOpacity, Text} = require('react-native');

    return {
        ChangeImage: ({sheetRef, handleTakeImage}: any) => {
            React.useEffect(() => {
                sheetRef.current = {
                    present: mockPresent,
                    dismiss: mockDismiss,
                };

                return () => {
                    sheetRef.current = null;
                };
            }, [sheetRef]);

            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    TouchableOpacity,
                    {
                        testID: 'take-photo',
                        onPress: () => handleTakeImage('photo'),
                    },
                    React.createElement(Text, null, 'Tomar foto'),
                ),
                React.createElement(
                    TouchableOpacity,
                    {
                        testID: 'choose-gallery',
                        onPress: () => handleTakeImage('gallery'),
                    },
                    React.createElement(Text, null, 'Abrir galería'),
                ),
            );
        },
    };
});

const mockTypes = [
    {id: '1', name: 'Cédula de ciudadanía'},
    {id: '2', name: 'Cédula de extranjería'},
];

type SetupOptions = {
    isLoading?: boolean;
    error?: string | null;
    typeIdentifications?: Array<{id: string; name: string}>;
};

const setup = async ({
                         isLoading = false,
                         error = null,
                         typeIdentifications = mockTypes,
                     }: SetupOptions = {}) => {
    (useAuth as jest.Mock).mockReturnValue({
        isLoading,
        error,
        clearError: mockClearError,
        register: mockRegister,
    });

    (useTypeIdentificationStore as jest.Mock).mockReturnValue({
        typeIdentifications,
        getTypeIdentifications: mockGetTypeIdentifications,
    });

    let renderer!: TestRenderer.ReactTestRenderer;

    await act(async () => {
        renderer = TestRenderer.create(<Register />);
        await Promise.resolve();
    });

    return renderer;
};

const changeInput = async (
    renderer: TestRenderer.ReactTestRenderer,
    field: string,
    value: string,
) => {
    await act(async () => {
        renderer.root
            .findByProps({testID: `input-${field}`})
            .props.onChangeText(value);
    });
};

const fillValidForm = async (
    renderer: TestRenderer.ReactTestRenderer,
) => {
    await changeInput(renderer, 'name', 'Carlos Pérez');
    await changeInput(renderer, 'phone', '3001234567');

    await act(async () => {
        renderer.root
            .findByProps({testID: 'select-identification'})
            .props.onPress();
    });

    await changeInput(renderer, 'identification', '123456789');
    await changeInput(renderer, 'email', 'CARLOS@EXAMPLE.COM');
    await changeInput(renderer, 'password', 'secret123');
    await changeInput(renderer, 'password_confirmation', 'secret123');
};

const submitForm = async (
    renderer: TestRenderer.ReactTestRenderer,
) => {
    await act(async () => {
        await renderer.root
            .findByProps({testID: 'register-button'})
            .props.onPress();

        await Promise.resolve();
        await Promise.resolve();
    });
};

describe('Register', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockSelectedTypeId.current = '1';

        mockRegister.mockResolvedValue(undefined);
        mockGetTypeIdentifications.mockResolvedValue(undefined);

        (openCamera as jest.Mock).mockResolvedValue({
            url: 'https://example.com/camera.jpg',
        });

        (openGallery as jest.Mock).mockResolvedValue({
            url: 'https://example.com/gallery.jpg',
        });
    });

    it('debe renderizar el formulario de registro', async () => {
        const renderer = await setup();

        expect(
            renderer.root.findByProps({testID: 'input-name'}),
        ).toBeTruthy();

        expect(
            renderer.root.findByProps({testID: 'input-phone'}),
        ).toBeTruthy();

        expect(
            renderer.root.findByProps({testID: 'input-identification'}),
        ).toBeTruthy();

        expect(
            renderer.root.findByProps({testID: 'input-email'}),
        ).toBeTruthy();

        expect(
            renderer.root.findByProps({testID: 'input-password'}),
        ).toBeTruthy();

        expect(
            renderer.root.findByProps({
                testID: 'input-password_confirmation',
            }),
        ).toBeTruthy();

        expect(
            renderer.root.findAllByType(Text).some(
                node => node.props.children === 'Registrarse',
            ),
        ).toBe(true);
    });

    it('debe consultar los tipos de identificación al montar la vista', async () => {
        await setup();

        expect(mockGetTypeIdentifications).toHaveBeenCalledTimes(1);
    });

    it('debe mostrar el error recibido desde useAuth', async () => {
        const renderer = await setup({
            error: 'El correo ya se encuentra registrado',
        });

        expect(
            renderer.root.findAllByType(Text).some(
                node =>
                    node.props.children ===
                    'El correo ya se encuentra registrado',
            ),
        ).toBe(true);
    });

    it('debe mostrar el texto de carga cuando isLoading es true', async () => {
        const renderer = await setup({isLoading: true});

        expect(
            renderer.root
                .findByProps({testID: 'register-button'})
                .findByType(Text).props.children,
        ).toBe('Iniciando...');
    });

    it('debe volver a la pantalla anterior al pulsar Iniciar sesión', async () => {
        const renderer = await setup();

        const loginButton = renderer.root
            .findAllByType(TouchableOpacity)
            .find(node =>
                node.findAllByType(Text).some(
                    text => text.props.children === 'Iniciar sesión',
                ),
            );

        expect(loginButton).toBeDefined();

        await act(async () => {
            loginButton!.props.onPress();
        });

        expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    it('debe abrir el modal para cambiar la imagen', async () => {
        const renderer = await setup();

        await act(async () => {
            renderer.root.findByType(Pressable).props.onPress();
        });

        expect(mockPresent).toHaveBeenCalledTimes(1);
    });

    it('debe seleccionar una imagen desde la cámara y cerrar el modal', async () => {
        const renderer = await setup();

        await act(async () => {
            await renderer.root
                .findByProps({testID: 'take-photo'})
                .props.onPress();
        });

        expect(openCamera).toHaveBeenCalledTimes(1);
        expect(mockDismiss).toHaveBeenCalledTimes(1);
    });

    it('debe seleccionar una imagen desde la galería y cerrar el modal', async () => {
        const renderer = await setup();

        await act(async () => {
            await renderer.root
                .findByProps({testID: 'choose-gallery'})
                .props.onPress();
        });

        expect(openGallery).toHaveBeenCalledTimes(1);
        expect(mockDismiss).toHaveBeenCalledTimes(1);
    });

    it('debe registrar al usuario con los datos correctos', async () => {
        const renderer = await setup();

        await fillValidForm(renderer);
        await submitForm(renderer);

        expect(mockRegister).toHaveBeenCalledTimes(1);

        expect(mockRegister).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Carlos Pérez',
                phone: '3001234567',
                identification: '123456789',
                email: 'carlos@example.com',
                password: 'secret123',
                password_confirmation: 'secret123',
                type_identification: '1',
                images: '',
            }),
        );

        expect(mockNavigateReplace).toHaveBeenCalledWith('Tab');
        expect(mockClearError).toHaveBeenCalledTimes(1);
    });

    it('no debe registrar al usuario si el formulario está vacío', async () => {
        const renderer = await setup();

        await submitForm(renderer);

        expect(mockRegister).not.toHaveBeenCalled();
        expect(mockNavigateReplace).not.toHaveBeenCalled();
    });

    it('debe enviar la imagen seleccionada al registrar al usuario', async () => {
        const renderer = await setup();

        await act(async () => {
            await renderer.root
                .findByProps({testID: 'take-photo'})
                .props.onPress();
        });

        await fillValidForm(renderer);
        await submitForm(renderer);

        expect(mockRegister).toHaveBeenCalledWith(
            expect.objectContaining({
                images: 'https://example.com/camera.jpg',
            }),
        );
    });

    it('debe enviar 0 como tipo de identificación si no encuentra el tipo seleccionado', async () => {
        mockSelectedTypeId.current = '99';

        const renderer = await setup({
            typeIdentifications: [
                {id: '1', name: 'Cédula de ciudadanía'},
            ],
        });

        await fillValidForm(renderer);
        await submitForm(renderer);

        expect(mockRegister).toHaveBeenCalledTimes(1);

        expect(mockRegister).toHaveBeenCalledWith(
            expect.objectContaining({
                type_identification: 0,
            }),
        );
    });
});
