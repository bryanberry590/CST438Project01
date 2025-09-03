//use mock to mock the database
//  potentially can mock the initDB function database.ts
//  if that doesn't work then figure out how to use mock to copy the schema and create a separate db for testing purposes

//test all helper functions for each table with test data

import React from 'react';
import renderer from 'react-test-renderer';
import jest, { beforeEach } from '@jest/globals';

import { initDB } from './database';

//setup to mock expo-sqlite
//this is only mocking the expo-sqlite commands being used currently
const mockExecAsync = jest.fn();
const mockRunAsync = jest.fn();
const mockGetAllAsync = jest.fn();

const mockDatabase = {
    execAsync: mockExecAsync,
    runAsync: mockRunAsync,
    getAllAsync: mockGetAllAsync
}

jest.mock('expo-sqlite', () => ({
    openDatabaseSync: jest.fn(() => mockDatabase)
}));

describe('Database Tests', () => {

    //this will clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('initDB', () =>{
        it('should create all 3 tables', async () => {
            await initDB();

            //check for foreign key call
            expect(mockExecAsync).toHaveBeenCalledWith('PRAGMA foreign_keys = ON');

            //check that the 3 tables were created with a correct sql string
            expect(mockExecAsync).toHaveBeenCalledWith('CREATE TABLE IF NOT EXISTS users');
            expect(mockExecAsync).toHaveBeenCalledWith('CREATE TABLE IF NOT EXISTS comments');
            expect(mockExecAsync).toHaveBeenCalledWith('CREATE TABLE IF NOT EXISTS news');

            //checks that the mockExecAsync was properly called all 4 times from above
            expect(mockExecAsync).toHaveBeenCalledTimes(4);
        });
    });

    describe('Helper Functions', () => {
        


    });



});



