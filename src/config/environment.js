const environment = {
  db: {
    dev: {
      url: 'mongodb://localhost:27017/dev_paltform_dev',
    },
    test: {
      url: 'mongodb://localhost:27017/dev_paltform_test',
    },
    prod: {
      url: 'mongodb://localhost:27017/dev_paltform_prod',
    },
  },
  app: {
    dev: {
      url: 'http://localhost:4000',
    },
    test: {
      url: 'mongodb://localhost:27017/dev_paltform_test',
    },
    prod: {
      url: 'mongodb://localhost:27017/dev_paltform_prod',
    },
  },
};

export default environment;
