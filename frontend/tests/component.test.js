global.Vue = require('vue/dist/vue.cjs.js')
const { mount } = require('@vue/test-utils')

const TestComponent = {
  template: '<div>{{ msg }}</div>',
  props: ['msg']
}

describe('TestComponent', () => {
  it('renders message', () => {
    const wrapper = mount(TestComponent, { props: { msg: 'Hello World' } })
    expect(wrapper.text()).toBe('Hello World')
  })
})
