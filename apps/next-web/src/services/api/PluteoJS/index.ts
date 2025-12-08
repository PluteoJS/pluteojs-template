import {apiServer, injectStore} from "./axiosConfig";
import ExampleService from "./ExampleService";

const exampleService = ExampleService(apiServer);

export {injectStore, exampleService};
