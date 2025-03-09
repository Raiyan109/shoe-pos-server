import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ISettings } from './settings.interface';
import { SettingsModel } from './settings.model';



const createSettingsIntoDB = async (settings: ISettings) => {
  const isSettingsExists = await SettingsModel.findOne({ name: settings.title })
  if (isSettingsExists) {
    throw new ApiError(StatusCodes.CONFLICT, 'This settings is already exists!');
  }
  const result = await SettingsModel.create(settings)
  return result
};


const getSettingsFromDB = async () => {
  const result = await SettingsModel.find();
  return result;
};

const updateSettingsIntoDB = async (payload: Partial<ISettings>) => {
  console.log(payload, 'payload from updatesettings service');

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