import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ISettings } from './settings.interface';
import { SettingsModel } from './settings.model';

// Create Settings
const createSettingsIntoDB = async (settings: ISettings) => {
  const isSettingsExists = await SettingsModel.findOne({ name: settings.title })
  if (isSettingsExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This settings is already exists!');
  }
  const result = await SettingsModel.create(settings)
  return result
};

// Find Settings
const getSettingsFromDB = async () => {
  const result = await SettingsModel.find();
  return result;
};

// Update Settings
const updateSettingsIntoDB = async (payload: Partial<ISettings>) => {
  const updatedSettings = await SettingsModel.findOneAndUpdate({}, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedSettings) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update settings');
  }

  return updatedSettings;
};



export const SettingsService = {
  createSettingsIntoDB,
  getSettingsFromDB,
  updateSettingsIntoDB
};