/* eslint-disable func-names */
require('dotenv').config();
const chai = require('chai');
const sinon = require('sinon');

const user = require('../services/user');
const db = require('../sql/db');

const { expect } = chai;
const { stub } = sinon;

describe('module authenticateUser', () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(function () {
    sinon.restore();
    this.queryStub = stub(db, 'query').resolves({
      rowCount: 0,
      rows: [],
    });
  });

  it('should throw an error if query fail', async function () {
    this.queryStub.rejects(new Error('Bad credentials'));
    try {
      await user.authenticateUser('toto@toto.fr', 'tata');
    } catch (err) {
      expect(err.message).to.equal('Bad credentials');
      expect(this.queryStub.callCount).to.equal(1);
      return;
    }
    throw new Error('Should have thrown an error');
  });

  it('should throw an error if query return 0 row', async function () {
    try {
      await user.authenticateUser('toto@toto.fr', 'tata');
    } catch (err) {
      expect(err.message).to.equal('Bad credentials');
      expect(this.queryStub.callCount).to.equal(1);
      return;
    }
    throw new Error('Should have thrown an error');
  });

  it('should succeed', async function () {
    this.queryStub.resolves({ rowCount: 1, rows: [{ email: 'toto@toto.fr' }] });
    const authUser = await user.authenticateUser('toto@toto.fr', 'tata');
    expect(authUser.email).to.equal('toto@toto.fr');
  });
});
