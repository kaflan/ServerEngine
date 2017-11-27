import {Request, Response, NextFunction} from "express";

export interface IError extends Error {
  status?: number;
}

export interface IExtendableError extends Error {
  name: string;
  message: string;
}

export interface IApiValidationError extends IExtendableError {
  responseCode: number;
  code: number;
  extra?: any;
}

export interface ApiAclDenyError extends IExtendableError {

}
