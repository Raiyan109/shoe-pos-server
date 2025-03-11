import { IAdminInterface, IAdminLoginInterface } from './admin.interface';
import AdminModel from './admin.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import { createToken } from '../../../util/createToken';


// login as admin
const loginAdminServices = async (payload: IAdminLoginInterface) => {
  // checking if the admin is exist
  const admin = await AdminModel?.isAdminExistsByPhone(payload.admin_phone);


  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'admin is not found');
  }

  //checking if the password is correct

  if (!(await AdminModel?.isPasswordMatched(payload?.admin_password, admin?.admin_password)))
    throw new ApiError(StatusCodes.FORBIDDEN, 'Password do not matched');

  //create token and sent to the  client

  const jwtPayload = {
    admin_phone: admin.admin_phone,
    admin_status: admin.admin_status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expire_in as string,
  );

  return {
    accessToken,
  };

};



// create an Admin
const registerAdminServices = async (payload: IAdminInterface) => {

  // checking if the admin is exist
  const admin = await AdminModel?.isAdminExistsByPhone(payload.admin_phone);


  if (admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Admin already exists!');
  }

  const result = await AdminModel.create(payload);

  //create token and sent to the  client
  const jwtPayload = {
    admin_phone: result.admin_phone,
    admin_status: result.admin_status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expire_in as string,
  );

  return {
    result,
    accessToken,
  };

  //return result;

};

export const AdminServices = {
  loginAdminServices,
  registerAdminServices
};