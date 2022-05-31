import React, { useEffect } from 'react';

const TestComponent = () => {
  useEffect(() => {
    console.log('test component loaded');
  }, []);

  return <div>TestComponent</div>;
};

export default React.memo(TestComponent);
