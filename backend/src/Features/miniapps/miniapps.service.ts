import { miniapps, miniapp_permissions } from "../../db.js";
import { RPC } from "enders-sync"




export function MiniAppAuth() {

}





export function createMiniApp(
    name:string, author:string, homepage:string, icon?:string
) {

    miniapp_permissions.insert({
        miniapp_name: name,
        miniapp_author: author,
        miniapp_homepage: author,
        miniapp_icons: author,
    });

    miniapps.insert({
        miniapp_name: name,
        miniapp_author: author,
        miniapp_homepage: author,
        miniapp_icons: author,
    });
}














export function loadMiniAppServices( rpc: RPC ) {
    //
}