/*!
 * Copyright (c) Laika LLC. All rights reserved.
 */

import React, {ReactElement, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import blogDetailStyles from './styles';

type BlogDetailRouteProp = RouteProp<RootStackParamList, 'BlogDetail'>;
type BlogDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @component BlogDetail
 * @return {ReactElement} - React component
 */
const BlogDetail = (): ReactElement => {
  const navigation = useNavigation<BlogDetailNavigationProp>();
  const route = useRoute<BlogDetailRouteProp>();
  const {blog} = route.params;

  // Contenido de ejemplo extendido para el blog
  const blogContent = blog.content || `
En un mundo donde la sostenibilidad se ha convertido en una prioridad, reducir nuestra huella de carbono es fundamental para preservar el medio ambiente para las futuras generaciones.

**¿Qué es la huella de carbono?**

La huella de carbono es la cantidad total de gases de efecto invernadero que generamos directa e indirectamente a través de nuestras actividades cotidianas. Esto incluye el transporte, el consumo de energía, los alimentos que comemos y los productos que compramos.

**Estrategias efectivas para reducir tu impacto:**

1. **Transporte sostenible**: Opta por caminar, usar bicicleta o transporte público. Si necesitas un auto, considera opciones eléctricas o híbridas.

2. **Eficiencia energética**: Cambia a bombillas LED, desconecta dispositivos electrónicos cuando no los uses y mejora el aislamiento de tu hogar.

3. **Alimentación consciente**: Reduce el consumo de carne, compra productos locales y de temporada, y evita el desperdicio de alimentos.

4. **Consumo responsable**: Compra menos pero mejor, repara en lugar de reemplazar, y elige productos con menor impacto ambiental.

5. **Gestión de residuos**: Recicla correctamente, compostea residuos orgánicos y reduce el uso de plásticos de un solo uso.

**El impacto de pequeños cambios:**

Cada acción cuenta. Si una persona reduce su huella de carbono en un 20%, y motiva a otras a hacer lo mismo, el efecto multiplicador puede generar un cambio significativo en nuestra comunidad.

**Herramientas para medir tu progreso:**

Existen aplicaciones y calculadoras online que te ayudan a monitorear tu huella de carbono y establecer metas realistas para reducirla gradualmente.

Recuerda: la sostenibilidad no es una meta, es un estilo de vida. Cada día es una oportunidad para tomar decisiones más conscientes y responsables con nuestro planeta.`;

  const defaultImage = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop';
  const readTime = blog.readTime || '5 min';
  const tags = blog.tags || ['Sostenibilidad', 'Medio Ambiente', 'Tips Verdes'];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerBackTitle: '',
      headerTintColor: colors.primary,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={blogDetailStyles.headerButton}>
          <Icon name="arrow-left" size={20} color={colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleShare}
          style={blogDetailStyles.headerButton}>
          <Icon name="share-alt" size={18} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${blog.title}\n\nPor ${blog.author}\n\n¡Descubre más tips ecológicos en nuestra app!`,
        title: blog.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleTagPress = (tag: string) => {
    // Aquí podrías navegar a una pantalla de búsqueda filtrada por tag
    console.log(`Filtrar por tag: ${tag}`);
  };

  return (
    <View style={blogDetailStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={blogDetailStyles.content}
        showsVerticalScrollIndicator={false}>
        
        {/* Imagen del artículo */}
        <View style={blogDetailStyles.imageContainer}>
          <Image
            source={{ uri: blog.image || defaultImage }}
            style={blogDetailStyles.blogImage}
            resizeMode="cover"
          />
        </View>

        <View style={blogDetailStyles.articleContent}>
          {/* Título */}
          <Text style={blogDetailStyles.title}>{blog.title}</Text>

          {/* Metadata */}
          <View style={blogDetailStyles.metadata}>
            <View style={blogDetailStyles.authorInfo}>
              <View style={blogDetailStyles.authorAvatar}>
                <Icon name="user" size={16} color={colors.primary} />
              </View>
              <Text style={blogDetailStyles.authorName}>Por {blog.author}</Text>
            </View>
            
            <View style={blogDetailStyles.metaDetails}>
              <View style={blogDetailStyles.metaItem}>
                <Icon name="calendar-alt" size={12} color={colors.gray} />
                <Text style={blogDetailStyles.metaText}>{blog.date}</Text>
              </View>
              <View style={blogDetailStyles.metaItem}>
                <Icon name="clock" size={12} color={colors.gray} />
                <Text style={blogDetailStyles.metaText}>{readTime} lectura</Text>
              </View>
            </View>
          </View>

          {/* Tags */}
          <View style={blogDetailStyles.tagsContainer}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={blogDetailStyles.tag}
                onPress={() => handleTagPress(tag)}>
                <Text style={blogDetailStyles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contenido del artículo */}
          <View style={blogDetailStyles.contentContainer}>
            <Text style={blogDetailStyles.articleText}>{blogContent}</Text>
          </View>

          {/* Acciones */}
          <View style={blogDetailStyles.actionsContainer}>
            <TouchableOpacity
              style={blogDetailStyles.actionButton}
              onPress={handleShare}>
              <Icon name="share-alt" size={16} color={colors.primary} />
              <Text style={blogDetailStyles.actionText}>Compartir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={blogDetailStyles.actionButton}>
              <Icon name="bookmark" size={16} color={colors.primary} />
              <Text style={blogDetailStyles.actionText}>Guardar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={blogDetailStyles.actionButton}>
              <Icon name="thumbs-up" size={16} color={colors.primary} />
              <Text style={blogDetailStyles.actionText}>Me gusta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BlogDetail;
