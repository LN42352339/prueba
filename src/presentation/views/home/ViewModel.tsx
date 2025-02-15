import {useState} from 'react';

const HomeViewModel = ({LogoutUseCase}) => {
  const [result, setResult] = useState(false);

  const logout = async () => {
    const {result, error} = await LogoutUseCase.run();
    setResult(result);
  };

  return {
    result,
    logout,
  };
};

export default HomeViewModel;
