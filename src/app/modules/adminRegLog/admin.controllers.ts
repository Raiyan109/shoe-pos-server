import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import AdminModel from "./admin.model";
import { AdminServices } from "./admin.services";


// login an admin
const loginAdmin = catchAsync(async (req, res) => {
  const resultController = await AdminServices.loginAdminServices(req.body);
  const { accessToken } = resultController;

  const adminLoginInfo = await AdminModel.find({ admin_phone: req.body.admin_phone })


  //console.log(adminLoginInfo);

  // Set token in HTTP-only cookie
  res.cookie('admin_token', `Bearer ${accessToken}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });


  res.status(StatusCodes.OK).json({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin logged in successfully',
    token: accessToken,
    data: adminLoginInfo,
  });
});


// create an admin
const registerAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.registerAdminServices(req.body);
  const token = result.accessToken

  // Set token in HTTP-only cookie
  res.cookie('admin_token', `Bearer ${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(StatusCodes.OK).json({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin registered successfully',
    data: result.result,
    token: token
  });
});


export const AdminControllers = {
  loginAdmin,
  registerAdmin
};