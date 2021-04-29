import { identity } from 'lodash';
import http from './httpService'


const apiEndpoint = '/users';

export function register(user){
        return http.post(apiEndpoint,user)
  

}
export async function getUserData() {
        return  http.get(apiEndpoint+"/me") 
        
      }
export async function updateUser(user){  
        const id = user._id
        await http.put(apiEndpoint+ "/me",user)
}