
import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';

it('demo test',()=>{
	expect(true).toBeTruthy()
})

test('renders App ', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
