export type AudioContextMockType = {
  createOscillator?: jest.Mock
  createGain?: jest.Mock
  resume?: jest.Mock
  state?: 'running' | 'suspended'
}