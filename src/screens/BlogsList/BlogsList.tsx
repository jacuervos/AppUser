import React, {ReactElement, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image, Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import blogsListStyles from './styles';
import useBlogStore from "../../store/blogStore.ts";

type BlogsListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @component BlogsList
 * @return {ReactElement} - React component
 */
const BlogsList = (): ReactElement => {
  const navigation = useNavigation<BlogsListNavigationProp>();
  const {blogs} = useBlogStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Blog Ecológicos',
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

  const handleBlogPress = (blog: string) => {
    Linking.openURL(blog);
  };

  const getDefaultImage = () => {
    return 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop';
  };

  return (
    <View style={blogsListStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Lista de blogs */}
      <ScrollView 
        style={blogsListStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={blogsListStyles.scrollContent}>

        {blogs.map((blog: any) => (
          <TouchableOpacity
            key={blog.id}
            style={blogsListStyles.blogCard}
            onPress={() => handleBlogPress(blog.url)}>
            
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

              <Text style={blogsListStyles.blogTitle}>{blog.title}</Text>
              <Text style={blogsListStyles.blogExcerpt}>{blog.description}</Text>

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
