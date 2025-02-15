import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useState} from 'react';
import * as ImagePicker from 'react-native-image-picker';

const PostCreateViewModel = ({CreatePostUseCase, GetUserUseCase}) => {
  const [file, setFile] = useState<any>(null);
  const [values, setValues] = useState({
    image: '',
    name: '',
    description: '',
    category: '',
    idUser: '',
  });
  const [categories, setCategories] = useState([
    {
      name: 'SUPERHÉROES',
      selected: false,
      image: require('../../../../../assets/img/icono_cat.png'),
    },
    {
      name: 'MARVEL CÓSMICO',
      selected: false,
      image: require('../../../../../assets/img/cat_2.png'),
    },
    {
      name: 'VILLANOS Y ANTIHÉROES ',
      selected: false,
      image: require('../../../../../assets/img/icono_cat4.png'),
    },
  ]);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getUser = () => {
    const {result, error} = GetUserUseCase.run();
    const myUser = result as FirebaseAuthTypes.User;
    onChange('idUser', myUser.uid);
  };

  const createPost = async () => {
    console.log('Values: ', values);
    // console.log('Categories: ', categories);
    setLoading(true);
    const {result, error} = await CreatePostUseCase.run(values, file);
    setResponse(result);
    setError(error);
    setLoading(false);
    if (result === true) {
      resetForm();
    }
  };

  const onRadioChange = (item: any) => {
    const updateState = categories.map(category =>
      category.name === item.name
        ? {...category, selected: true}
        : {...category, selected: false},
    );
    setCategories(updateState);
    onChange('category', item.name);
  };

  const onChange = (prop: string, value: any) => {
    setValues({...values, [prop]: value});
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    if (!result.didCancel) {
      if (result.assets !== undefined) {
        onChange('image', result.assets[0].uri);
        setFile(result.assets[0]);
      }
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 1,
    });
    if (!result.didCancel) {
      if (result.assets !== undefined) {
        onChange('image', result.assets[0].uri);
        setFile(result.assets[0]);
      }
    }
  };

  const resetForm = () => {
    const updateState = categories.map(category => {
      return {...category, selected: false};
    });
    setCategories(updateState);
    setValues({
      ...values,
      name: '',
      image: '',
      description: '',
      category: '',
    });
    setFile(null);
    setResponse(false);
    setError('');
  };

  return {
    ...values,
    file,
    categories,
    response,
    error,
    loading,
    takePhoto,
    pickImage,
    onChange,
    onRadioChange,
    createPost,
    getUser,
    setError,
  };
};

export default PostCreateViewModel;
