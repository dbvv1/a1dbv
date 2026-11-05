use lr_bgp::path::AttrType;
pub fn attribute_name(value: AttrType) -> &'static str {
    match value {
        AttrType::Origin => "Origin",
        AttrType::AsPath => "AsPath",
        AttrType::NextHop => "NextHop",
        AttrType::MultiExitDisc => "MultiExitDisc",
        AttrType::LocalPref => "LocalPref",
        AttrType::AtomicAggregate => "AtomicAggregate",
        AttrType::Aggregator => "Aggregator",
        AttrType::Communities => "Communities",
        AttrType::OriginatorId => "OriginatorId",
        AttrType::ClusterList => "ClusterList",
        AttrType::MpReachNlri => "MpReachNlri",
        AttrType::MpUnreachNlri => "MpUnreachNlri",
        AttrType::ExtendedCommunities => "ExtendedCommunities",
        AttrType::As4Path => "As4Path",
        AttrType::As4Aggregator => "As4Aggregator",
        AttrType::PmsiTunnel => "PmsiTunnel",
        AttrType::TunnelEncap => "TunnelEncap",
        AttrType::TrafficEngineering => "TrafficEngineering",
        AttrType::LargeCommunities => "LargeCommunities",
        AttrType::Otc => "Otc",
        AttrType::LrMplsLabelStack => "LrMplsLabelStack",
        AttrType::LrExchangePlaneRecords => "LrExchangePlaneRecords",
        AttrType::Other(_) => "Other",
    }
}
