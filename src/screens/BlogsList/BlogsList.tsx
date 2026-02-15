/*!
 * Copyright (c) Laika LLC. All rights reserved.
 */

import React, {ReactElement, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import blogsListStyles from './styles';

type BlogsListRouteProp = RouteProp<RootStackParamList, 'BlogsList'>;
type BlogsListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @component BlogsList
 * @return {ReactElement} - React component
 */
const BlogsList = (): ReactElement => {
  const navigation = useNavigation<BlogsListNavigationProp>();
  const route = useRoute<BlogsListRouteProp>();
  const {initialBlogs} = route.params || {};

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Blogs expandidos con más información
  const allBlogs = initialBlogs || [
    {
      id: 1,
      title: 'Cómo reducir tu huella de carbono',
      author: 'EcoTeam',
      date: '2024-02-10',
      category: 'Sostenibilidad',
      excerpt: 'Descubre estrategias efectivas para reducir tu impacto ambiental en el día a día.',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop',
      tags: ['Sostenibilidad', 'Medio Ambiente', 'Tips Verdes']
    },
    {
      id: 2,
      title: 'Recetas sostenibles para el hogar',
      author: 'GreenLife',
      date: '2024-02-08',
      category: 'Hogar',
      excerpt: 'Aprende a preparar productos de limpieza ecológicos y naturales en casa.',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
      tags: ['Hogar', 'DIY', 'Ecológico']
    },
    {
      id: 3,
      title: 'Tecnología verde del futuro',
      author: 'TechEco',
      date: '2024-02-05',
      category: 'Tecnología',
      excerpt: 'Explora las innovaciones tecnológicas que están revolucionando la sostenibilidad.',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
      tags: ['Tecnología', 'Innovación', 'Verde']
    },
    {
      id: 4,
      title: 'Jardines urbanos: cultiva tu propio alimento',
      author: 'UrbanGarden',
      date: '2024-02-03',
      category: 'Agricultura',
      excerpt: 'Convierte pequeños espacios en jardines productivos y sostenibles.',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
      tags: ['Jardines', 'Agricultura', 'Urbano']
    },
    {
      id: 5,
      title: 'Moda sostenible: viste consciente',
      author: 'EcoFashion',
      date: '2024-02-01',
      category: 'Moda',
      excerpt: 'Descubre marcas y prácticas de moda que cuidan el planeta.',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
      tags: ['Moda', 'Sostenible', 'Consciente']
    },
    {
      id: 6,
      title: 'Transporte verde en la ciudad',
      author: 'MobilityGreen',
      date: '2024-01-30',
      category: 'Transporte',
      excerpt: 'Opciones de movilidad sustentable para el día a día urbano.',
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=400&fit=crop',
      tags: ['Transporte', 'Movilidad', 'Ciudad']
    }
  ];

  const categories = ['Todos', ...new Set(allBlogs.map((blog: any) => blog.category))];
  
  const filteredBlogs = selectedCategory === 'Todos' 
    ? allBlogs 
    : allBlogs.filter((blog: any) => blog.category === selectedCategory);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Blog Ecológico',
      headerBackTitle: '',
      headerTintColor: colors.primary,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  const handleBlogPress = (blog: any) => {
    navigation.navigate('BlogDetail', { blog });
  };

  const getDefaultImage = () => {
    return 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop';
  };

  return (
    <View style={blogsListStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Filtros de categoría */}
      <View style={blogsListStyles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={blogsListStyles.categoriesScroll}>
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category}
              style={[
                blogsListStyles.categoryButton,
                selectedCategory === category && blogsListStyles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text style={[
                blogsListStyles.categoryText,
                selectedCategory === category && blogsListStyles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de blogs */}
      <ScrollView 
        style={blogsListStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={blogsListStyles.scrollContent}>
        
        <View style={blogsListStyles.statsContainer}>
          <Text style={blogsListStyles.statsText}>
            {filteredBlogs.length} artículos disponibles
          </Text>
        </View>

        {filteredBlogs.map((blog: any) => (
          <TouchableOpacity
            key={blog.id}
            style={blogsListStyles.blogCard}
            onPress={() => handleBlogPress(blog)}>
            
            {/* Imagen del blog */}
            <View style={blogsListStyles.imageContainer}>
              <Image
                source={{ uri: blog.image || getDefaultImage() }}
                style={blogsListStyles.blogImage}
                resizeMode="cover"
              />
            </View>

            {/* Contenido del blog */}
            <View style={blogsListStyles.blogContent}>
              <View style={blogsListStyles.blogHeader}>
                <View style={blogsListStyles.categoryTag}>
                  <Text style={blogsListStyles.categoryTagText}>{blog.category}</Text>
                </View>
                <View style={blogsListStyles.readTimeContainer}>
                  <Icon name="clock" size={12} color={colors.gray} />
                  <Text style={blogsListStyles.readTimeText}>{blog.readTime}</Text>
                </View>
              </View>

              <Text style={blogsListStyles.blogTitle}>{blog.title}</Text>
              <Text style={blogsListStyles.blogExcerpt}>{blog.excerpt}</Text>

              <View style={blogsListStyles.blogMeta}>
                <View style={blogsListStyles.authorInfo}>
                  <Icon name="user" size={14} color={colors.gray} />
                  <Text style={blogsListStyles.authorText}>Por {blog.author}</Text>
                </View>
                <View style={blogsListStyles.dateInfo}>
                  <Icon name="calendar-alt" size={14} color={colors.gray} />
                  <Text style={blogsListStyles.dateText}>{blog.date}</Text>
                </View>
              </View>

              {/* Tags */}
              <View style={blogsListStyles.tagsContainer}>
                {blog.tags?.slice(0, 3).map((tag: any, index: number) => (
                  <View key={`${blog.id}-${tag}`} style={blogsListStyles.tag}>
                    <Text style={blogsListStyles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Icono de navegación */}
            <View style={blogsListStyles.navigationIcon}>
              <Icon name="chevron-right" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default BlogsList;
