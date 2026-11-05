use lr_bgp::path::AttrType;
fn main() {
 let mut values = vec![AttrType::Origin, AttrType::AsPath, AttrType::NextHop, AttrType::MultiExitDisc, AttrType::LocalPref, AttrType::AtomicAggregate, AttrType::Aggregator, AttrType::Communities, AttrType::OriginatorId, AttrType::ClusterList, AttrType::MpReachNlri, AttrType::MpUnreachNlri, AttrType::ExtendedCommunities, AttrType::As4Path, AttrType::As4Aggregator, AttrType::PmsiTunnel, AttrType::TunnelEncap, AttrType::TrafficEngineering, AttrType::LargeCommunities, AttrType::Otc, AttrType::LrMplsLabelStack, AttrType::LrExchangePlaneRecords];
 values.extend((0..=255).map(AttrType::Other));
 for (i, a) in values.iter().enumerate() { for (j,b) in values.iter().enumerate() { println!("{i},{j},{:?}", a.partial_cmp(b)); } }
}
