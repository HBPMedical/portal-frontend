import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
import '@testing-library/jest-dom'

function noOp() {}

if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp });
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5 * 60 * 1000;

configure({ adapter: new Adapter() });
