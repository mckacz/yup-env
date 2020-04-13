import * as yup from 'yup'
import parse from './index'

describe('yup-env', () => {
  test('one level', () => {
    const schema = yup.object()
      .noUnknown()
      .shape({
        foo:    yup.string(),
        barBaz: yup.number(),
      })

    const env = {
      FOO:     'qux',
      BAR_BAZ: '42',
      QUX:     'abc',
    }

    expect(parse({ schema, env })).toEqual({
      foo:    'qux',
      barBaz: 42,
    })
  })

  test('one level with prefix', () => {
    const schema = yup.object()
      .noUnknown()
      .shape({
        foo:    yup.string(),
        barBaz: yup.number(),
      })

    const env = {
      ABC_FOO: 'qux',
      BAR_BAZ: '42',
      ABC_QUX: 'abc',
    }

    const prefix = 'ABC_'

    expect(parse({ schema, env, prefix })).toEqual({
      foo: 'qux',
    })
  })

  test('one level validation', () => {
    const schema = yup.object()
      .noUnknown()
      .shape({
        foo:    yup.string().min(5),
        barBaz: yup.number(),
      })

    const env = {
      FOO:     'qux',
      BAR_BAZ: '42',
      QUX:     'abc',
    }

    expect(() => parse({ schema, env })).toThrow('foo must be at least 5 characters')

    env.FOO = 'quuux'

    expect(parse({ schema, env })).toEqual({
      foo:    'quuux',
      barBaz: 42,
    })
  })

  test('nested', () => {
    const schema = yup.object()
      .noUnknown()
      .shape({
        foo: yup.string(),
        bar: yup.object()
               .noUnknown()
               .shape({
                 qux:        yup.number(),
                 loremIpsum: yup.string(),
                 deep:       yup.object()
                               .noUnknown()
                               .shape({
                                 space: yup.number(),
                               }),
               }),
      })

    const env = {
      FOO:              'qux',
      BAR__QUX:         '123',
      BAR__LOREM_IPSUM: 'dolor sit amet',
      BAR__DEEP__SPACE: '1',
    }

    expect(parse({ schema, env })).toEqual({
      foo: 'qux',
      bar: {
        qux:        123,
        loremIpsum: 'dolor sit amet',
        deep:       {
          space: 1,
        },
      },
    })
  })

  test('nested with prefix', () => {
    const schema = yup.object()
      .noUnknown()
      .shape({
        foo: yup.string(),
        bar: yup.object()
               .noUnknown()
               .shape({
                 qux:        yup.number(),
                 loremIpsum: yup.string(),
                 deep:       yup.object()
                               .noUnknown()
                               .shape({
                                 space: yup.number(),
                               }),
               }),
      })

    const env = {
      FOO:                   'qux',
      BAR__LOREM_IPSUM:      'dolor sit amet',
      ABC__BAR__QUX:         '123',
      ABC__BAR__DEEP__SPACE: '1',
    }

    const prefix = 'ABC__'

    expect(parse({ schema, env, prefix })).toEqual({
      bar: {
        qux:  123,
        deep: {
          space: 1,
        },
      },
    })
  })

  test('nested with validation', () => {
    const schema = yup.object()
      .noUnknown()
      .shape({
        foo: yup.string(),
        bar: yup.object()
               .noUnknown()
               .shape({
                 qux:        yup.number(),
                 loremIpsum: yup.string(),
                 deep:       yup.object()
                               .noUnknown()
                               .shape({
                                 space: yup.number().max(1),
                               }),
               }),
      })

    const env = {
      FOO:                   'qux',
      BAR__LOREM_IPSUM:      'dolor sit amet',
      ABC__BAR__QUX:         '123',
      ABC__BAR__DEEP__SPACE: '2',
    }

    const prefix = 'ABC__'

    expect(() => parse({ schema, env, prefix })).toThrow('bar.deep.space must be less than or equal to 1')
  })

  test('nested with custom level separator', () => {
    const schema = yup.object()
      .noUnknown()
      .shape({
        foo: yup.string(),
        bar: yup.object()
               .noUnknown()
               .shape({
                 qux:        yup.number(),
                 loremIpsum: yup.string(),
                 deep:       yup.object()
                               .noUnknown()
                               .shape({
                                 space: yup.number(),
                               }),
               }),
      })

    const env = {
      'FOO':             'qux',
      'BAR-QUX':         '123',
      'BAR-LOREM_IPSUM': 'dolor sit amet',
      'BAR-DEEP-SPACE':  '1',
    }

    const levelSeparator = '-'

    expect(parse({ schema, env, levelSeparator })).toEqual({
      foo: 'qux',
      bar: {
        qux:        123,
        loremIpsum: 'dolor sit amet',
        deep:       {
          space: 1,
        },
      },
    })
  })
})
