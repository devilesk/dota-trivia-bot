var dota2 = require('dota2');
var channelTypeEnum = dota2.schema.lookupEnum("DOTAChatChannelType_t");
var channelTypeAliasMap = {};

function getChannelAlias(channelTypeName) {
    return channelTypeName.replace('DOTAChannelType_', '').toLowerCase();
}

for (channelTypeName in channelTypeEnum) {
    if (channelTypeEnum.hasOwnProperty(channelTypeName)) {
        channelTypeAliasMap[getChannelAlias(channelTypeName)] = channelTypeName;
    }
}

function getChannelType(channelTypeName) {
    return channelTypeEnum[channelTypeAliasMap[getChannelAlias(channelTypeName || "custom")]];
}

module.exports = getChannelType;