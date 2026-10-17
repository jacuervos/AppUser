
import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {
    Text,
    TouchableOpacity,
    Pressable,
    Image,
} from 'react-native';

import Profile from '../../src/screens/Profile/Profile';
import {useAuth} from '../../src/hooks/useAuth';
import {openCamera, openGallery} from '../../src/functions/Camera';

const mockGoBack = jest.fn();
const mockUpdateProfile = jest.fn();
const mockClearError = jest.fn();
const mockPresent = jest.fn();
const mockDismiss = jest.fn();
const mockToastShow = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        goBack: mockGoBack,
    }),
}));

jest.mock('../../src/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../src/functions/Camera', () => ({
    openCamera: jest.fn(),
    openGallery: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
    __esModule: true,
    default: {
        show: mockToastShow,
    },
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

jest.mock('react-native-vector-icons/FontAwesome5', () => {
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
                                 disabled,
                             }: any) =>
            React.createElement(TextInput, {
                testID: `input-${valueChange}`,
                accessibilityLabel: label,
                value,
                editable: !disabled,
                onChangeText: (text: string) =>
                    change(valueChange, text),
            }),
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
                    testID: 'update-button',
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

const mockUserInfo = {
    id: 7,
    name: 'Carlos Pérez',
    phone: '3001234567',
    identification: '123456789',
    email: 'carlos@example.com',
    photo: 'https://example.com/profile.jpg',
};

type SetupOptions = {
    isLoading?: boolean;
    error?: string | null;
    userInfo?: typeof mockUserInfo | null;
};

const setup = async ({
                         isLoading = false,
                         error = null,
                         userInfo = mockUserInfo,
                     }: SetupOptions = {}) => {
    (useAuth as jest.Mock).mockReturnValue({
        isLoading,
        error,
        userInfo,
        clearError: mockClearError,
        updateProfile: mockUpdateProfile,
    });

    let renderer!: TestRenderer.ReactTestRenderer;

    await act(async () => {
        renderer = TestRenderer.create(<Profile />);
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
    await changeInput(renderer, 'name', 'Carlos Pérez actualizado');
    await changeInput(renderer, 'phone', '3111234567');
};

const submitForm = async (
    renderer: TestRenderer.ReactTestRenderer,
) => {
    await act(async () => {
        await renderer.root
            .findByProps({testID: 'update-button'})
            .props.onPress();

        await Promise.resolve();
        await Promise.resolve();
    });
};

describe('Profile', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockUpdateProfile.mockResolvedValue(undefined);

        (openCamera as jest.Mock).mockResolvedValue({
            url: 'https://example.com/camera.jpg',
        });

        (openGallery as jest.Mock).mockResolvedValue({
            url: 'https://example.com/gallery.jpg',
        });
    });

    it('debe renderizar el formulario con la información del usuario', async () => {
        const renderer = await setup();

        expect(
            renderer.root.findByProps({testID: 'input-name'}).props.value,
        ).toBe('Carlos Pérez');

        expect(
            renderer.root.findByProps({testID: 'input-phone'}).props.value,
        ).toBe('3001234567');

        expect(
            renderer.root.findByProps({
                testID: 'input-identification',
            }).props.value,
        ).toBe('123456789');

        expect(
            renderer.root.findByProps({testID: 'input-email'}).props.value,
        ).toBe('carlos@example.com');

        expect(
            renderer.root.findAllByType(Text).some(
                node =>
                    node.props.children === 'Actualizar información',
            ),
        ).toBe(true);
    });

    it('debe mostrar el error recibido desde useAuth', async () => {
        const renderer = await setup({
            error: 'No fue posible actualizar el perfil',
        });

        expect(
            renderer.root.findAllByType(Text).some(
                node =>
                    node.props.children ===
                    'No fue posible actualizar el perfil',
            ),
        ).toBe(true);
    });

    it('debe mostrar el texto de carga cuando isLoading es true', async () => {
        const renderer = await setup({isLoading: true});

        expect(
            renderer.root
                .findByProps({testID: 'update-button'})
                .findByType(Text).props.children,
        ).toBe('Actualizando...');
    });

    it('debe deshabilitar el botón mientras actualiza', async () => {
        const renderer = await setup({isLoading: true});

        expect(
            renderer.root.findByProps({testID: 'update-button'}).props.disabled,
        ).toBe(true);
    });

    it('debe regresar a la pantalla anterior al pulsar el botón de volver', async () => {
        const renderer = await setup();

        const backButton = renderer.root
            .findAllByType(TouchableOpacity)
            .find(node =>
                node.findAllByType(Text).some(
                    text => text.props.children === 'arrow-left',
                ),
            );

        expect(backButton).toBeDefined();

        await act(async () => {
            backButton!.props.onPress();
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

        const profileImage = renderer.root.findByType(Image);

        expect(profileImage.props.source).toEqual({
            uri: 'https://example.com/camera.jpg',
        });
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

        const profileImage = renderer.root.findByType(Image);

        expect(profileImage.props.source).toEqual({
            uri: 'https://example.com/gallery.jpg',
        });
    });

    it('debe conservar la foto actual si no se selecciona una nueva', async () => {
        const renderer = await setup();

        await fillValidForm(renderer);
        await submitForm(renderer);

        const [payload] = mockUpdateProfile.mock.calls[0];

        expect(payload).not.toHaveProperty('images');
    });

    it('debe enviar la nueva imagen al actualizar el perfil', async () => {
        const renderer = await setup();

        await act(async () => {
            await renderer.root
                .findByProps({testID: 'take-photo'})
                .props.onPress();
        });

        await fillValidForm(renderer);
        await submitForm(renderer);

        expect(mockUpdateProfile).toHaveBeenCalledWith(
            expect.objectContaining({
                images: 'https://example.com/camera.jpg',
                identification: '123456789',
            }),
            7,
        );
    });

    it('debe enviar la nueva imagen de la galería al actualizar el perfil', async () => {
        const renderer = await setup();

        await act(async () => {
            await renderer.root
                .findByProps({testID: 'choose-gallery'})
                .props.onPress();
        });

        await fillValidForm(renderer);
        await submitForm(renderer);

        expect(mockUpdateProfile).toHaveBeenCalledWith(
            expect.objectContaining({
                images: 'https://example.com/gallery.jpg',
            }),
            7,
        );
    });

    it('debe usar el identificador 0 si el usuario no tiene ID', async () => {
        const renderer = await setup({
            userInfo: {
                ...mockUserInfo,
                id: undefined as any,
            },
        });

        await fillValidForm(renderer);
        await submitForm(renderer);

        expect(mockUpdateProfile).toHaveBeenCalledWith(
            expect.any(Object),
            0,
        );
    });

    it('no debe actualizar el perfil si el nombre está vacío', async () => {
        const renderer = await setup();

        await changeInput(renderer, 'name', '');
        await changeInput(renderer, 'phone', '3111234567');
        await submitForm(renderer);

        expect(mockUpdateProfile).not.toHaveBeenCalled();
        expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('no debe actualizar el perfil si el teléfono está vacío', async () => {
        const renderer = await setup();

        await changeInput(renderer, 'name', 'Carlos Pérez');
        await changeInput(renderer, 'phone', '');
        await submitForm(renderer);

        expect(mockUpdateProfile).not.toHaveBeenCalled();
        expect(mockGoBack).not.toHaveBeenCalled();
    });
});
