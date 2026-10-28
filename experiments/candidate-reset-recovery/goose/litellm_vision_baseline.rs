use futures::StreamExt;
use goose::providers::{base::Provider, litellm::LiteLLMProvider};
use goose_providers::{conversation::message::Message, model::ModelConfig};
use rmcp::model::{CallToolRequestParams, CallToolResult, ContentBlock};
use serde_json::{json, Value};
use wiremock::{
    matchers::{method, path},
    Mock, MockServer, ResponseTemplate,
};

const PNG: &str =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1sAAAAASUVORK5CYII=";

async fn check_vision_request(
    metadata: Value,
    declared: Option<bool>,
    model_name: &str,
    streaming: bool,
    expected: bool,
) {
    let server = MockServer::start().await;
    Mock::given(method("GET"))
        .and(path("/model/info"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({
            "data": [{"model_name": model_name, "model_info": metadata}]
        })))
        .expect(1)
        .mount(&server)
        .await;

    let response = if streaming {
        let chunk = json!({
            "id": "test", "object": "chat.completion.chunk", "created": 0,
            "model": model_name, "choices": [{"index": 0,
            "delta": {"role": "assistant", "content": "mock response"},
            "finish_reason": "stop"}]
        });
        ResponseTemplate::new(200).set_body_raw(
            format!("data: {chunk}\n\ndata: [DONE]\n\n"),
            "text/event-stream",
        )
    } else {
        ResponseTemplate::new(200).set_body_json(json!({
            "id": "test", "model": model_name,
            "choices": [{"message": {"role": "assistant", "content": "mock response"},
                         "finish_reason": "stop"}]
        }))
    };
    Mock::given(method("POST"))
        .and(path("/v1/chat/completions"))
        .respond_with(response)
        .expect(2)
        .mount(&server)
        .await;

    let root = tempfile::tempdir().unwrap();
    let host = server.uri();
    let _guard = env_lock::lock_env([
        ("GOOSE_PATH_ROOT", root.path().to_str()),
        ("GOOSE_DISABLE_KEYRING", Some("1")),
        ("GOOSE_ADDITIONAL_CONFIG_FILES", None),
        ("LITELLM_API_KEY", Some("local-test-key")),
        ("LITELLM_HOST", Some(host.as_str())),
        ("LITELLM_BASE_PATH", Some("v1/chat/completions")),
        ("LITELLM_CUSTOM_HEADERS", None),
        (
            "LITELLM_SUPPORTS_STREAMING",
            Some(if streaming { "true" } else { "false" }),
        ),
    ]);
    let provider = LiteLLMProvider::from_env(None).await.unwrap();
    let mut model = ModelConfig::new(model_name);
    if let Some(value) = declared {
        model = model.with_vision_support(value);
    }
    let model = model.with_canonical_vision_support("litellm");
    if model_name == "team-vision" && declared.is_none() {
        assert_eq!(model.supports_vision, None);
    }
    if model_name == "gpt-4o" && declared.is_none() {
        assert_eq!(model.supports_vision, Some(true));
    }
    let messages = [
        Message::user()
            .with_text("Describe this image")
            .with_image(PNG, "image/png"),
        Message::assistant()
            .with_tool_request("image1", Ok(CallToolRequestParams::new("read_image"))),
        Message::user().with_tool_response(
            "image1",
            Ok(CallToolResult::success(vec![ContentBlock::image(
                PNG,
                "image/png",
            )])),
        ),
    ];
    for _ in 0..2 {
        let mut stream = provider
            .stream(&model, "Describe images", &messages, &[])
            .await
            .unwrap();
        while let Some(item) = stream.next().await {
            item.unwrap();
        }
    }

    let requests = server.received_requests().await.unwrap();
    assert_eq!(
        requests
            .iter()
            .filter(|r| r.url.path() == "/model/info")
            .count(),
        1
    );
    let bodies: Vec<Value> = requests
        .iter()
        .filter(|r| r.url.path() == "/v1/chat/completions")
        .map(|r| r.body_json().unwrap())
        .collect();
    assert_eq!(bodies.len(), 2);
    let mut image_counts = Vec::new();
    let mut omissions = Vec::new();
    for (request_number, body) in bodies.iter().enumerate() {
        let serialized = body.to_string();
        let image_count = serialized
            .matches(&format!("data:image/png;base64,{PNG}"))
            .count();
        eprintln!("request_number={request_number} model={model_name} metadata={metadata} declared={declared:?} streaming={streaming} image_count={image_count} payload={body}");
        image_counts.push(image_count);
        omissions.push(serialized.contains("image omitted"));
    }
    assert_eq!(
        image_counts,
        vec![if expected { 2 } else { 0 }; 2],
        "{bodies:?}"
    );
    assert_eq!(omissions, vec![!expected; 2], "{bodies:?}");
}

#[test_case::test_case(false; "json")]
#[test_case::test_case(true; "sse")]
#[tokio::test]
async fn alias_uses_discovered_vision(streaming: bool) {
    check_vision_request(
        json!({"supports_vision": true, "supports_prompt_caching": false}),
        None,
        "team-vision",
        streaming,
        true,
    )
    .await;
}

#[test_case::test_case(Some(true), false, true; "explicit_true_beats_false")]
#[test_case::test_case(Some(false), true, false; "explicit_false_beats_true")]
#[test_case::test_case(None, false, false; "discovered_false")]
#[tokio::test]
async fn vision_boolean_controls(declared: Option<bool>, discovered: bool, expected: bool) {
    check_vision_request(
        json!({"supports_vision": discovered}),
        declared,
        "team-vision",
        false,
        expected,
    )
    .await;
}

#[test_case::test_case(json!({}); "missing")]
#[test_case::test_case(json!({"supports_vision": null}); "null")]
#[test_case::test_case(json!({"supports_vision": "true"}); "not_boolean")]
#[tokio::test]
async fn unspecified_vision_remains_disabled(metadata: Value) {
    check_vision_request(metadata, None, "team-vision", false, false).await;
}

#[tokio::test]
async fn canonical_vision_remains_enabled_without_vision_metadata() {
    check_vision_request(json!({}), None, "gpt-4o", false, true).await;
}
