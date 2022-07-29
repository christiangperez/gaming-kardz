import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const HocWithRouter = (Component: any) => {
  const Wrapper = (props: any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return <Component {...props} router={{ location, navigate, params }} />;
  };

  return Wrapper;
};
