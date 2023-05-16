import React from 'react';
// import { setOpenApiBase } from 'api/configOpenApi';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';

function App() {
	// Will not work until openapi is setup
	// useEffect(() => {
	//   setOpenApiBase();
	// }, []);

	return (
		<RouterProvider router={router} />
	);
}

export default App;
