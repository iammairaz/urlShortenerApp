
import { UrlSchema } from "../models/dbSchemas/urlSchema";
import { IRequestUrl, IUrl } from "../models/interfaces/IUrl";
import { NO_DATA_AVL_MSG, SOMETHING_WENT_WRG, SUCCESS_MSG } from "../utils/messages/message";
import { APIResponse, ResponseWithObject } from "../utils/status/status";
import { ErrorHandler } from "./errorHandlerService";
import { BASE } from "./constantService";
import { generateUniqueId } from "../utils/common/common";
import { redirectSchema } from "../models/dbSchemas/redirectSchema";
import { IRedirect } from "../models/interfaces/IRedirect";

const shortUrl = async (requestedUrlDetails: IRequestUrl,email:string) => {
    if (requestedUrlDetails.customAlias) {
        const isAliasUsed = await UrlSchema.findOne({ urlId: requestedUrlDetails.customAlias });
        if (isAliasUsed) {
            throw new ErrorHandler(400, "Alias is already in used, Please try different Alias")
        }
    }
    let urlId = requestedUrlDetails.customAlias ? requestedUrlDetails.customAlias : generateUniqueId()
    const shortUrl = `${BASE.URL}/api/task/redirect/${urlId}`;

    const processUrl: Partial<IUrl> = {
        origUrl: requestedUrlDetails.longUrl,
        shortUrl: shortUrl,
        urlId: urlId,
        createdBy: email
    };

    if (requestedUrlDetails.topic) {
        processUrl.topic = requestedUrlDetails.topic;
    }

    const urlData: any = await UrlSchema.findOneAndUpdate(
        { origUrl: requestedUrlDetails.longUrl },
        { $set: processUrl },
        { new: true, upsert: true }
    );
    let response = {
        shortUrl: urlData.shortUrl,
        createdAt: urlData.createdAt
    }
    if (urlData) {
        console.log(`Short URL created: ${shortUrl}`);
        return new ResponseWithObject(200, SUCCESS_MSG, response);
    } else {
        throw new ErrorHandler(400, SOMETHING_WENT_WRG);
    }

};
const saveUserDetails = async (ip: string, osType: string, deviceType: string, urlId: string, topic?: string) => {
    const toInsertData: Partial<IRedirect> = {
        ip: ip,
        os: osType,
        url: urlId,
        device: deviceType,
        createdAt: new Date()
    }
    if (topic) {
        toInsertData.topic = topic;
    }
    await new redirectSchema(toInsertData).save();
}
const updateUrlIncrement = async (url: string) => {
    await UrlSchema.updateOne(
        { origUrl: url },
        {
            $inc: { clicks: 1 }
        }
    )
}
const redirectTo = async (alias: string, ip: any, osType: string, deviceType: string) => {
    const urlData = await UrlSchema.findOne({ urlId: alias });
    if (!urlData) {
        throw new ErrorHandler(404, NO_DATA_AVL_MSG)
    }
    await saveUserDetails(ip, osType, deviceType, urlData.urlId, urlData.topic);
    await updateUrlIncrement(urlData.origUrl);
    return new ResponseWithObject(200, SUCCESS_MSG, urlData)

}

export default {
    shortUrl,
    redirectTo
};
