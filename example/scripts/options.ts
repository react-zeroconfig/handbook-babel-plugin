import { getBrowserslistQuery } from '@rocket-scripts/browserslist';

export const options = {
  webpackConfig: {
    externals: {
      typescript: 'ts',
    },
  },
  babelLoaderOptions: {
    presets: [
      [
        require.resolve('@rocket-scripts/react-preset/babelPreset'),
        {
          modules: false,
          targets: getBrowserslistQuery({ cwd: process.cwd() }),
        },
      ],
    ],
    plugins: [require.resolve('@handbook/babel-plugin')],
  },
};