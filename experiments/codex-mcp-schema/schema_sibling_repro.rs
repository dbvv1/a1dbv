use codex_code_mode_protocol::CodeModeToolKind;
use codex_code_mode_protocol::ToolDefinition;
use codex_code_mode_protocol::augment_tool_definition;
use codex_code_mode_protocol::render_json_schema_to_typescript;
use codex_protocol::ToolName;
use serde_json::Value;
use serde_json::json;

fn object_schema() -> Value {
    json!({
        "type": "object",
        "properties": {
            "field_a": { "type": "object", "additionalProperties": false },
            "field_n": { "type": "object", "additionalProperties": false }
        },
        "additionalProperties": false
    })
}

#[test]
fn ordinary_object_keeps_declared_properties() {
    let schema = object_schema();
    assert_eq!(
        render_json_schema_to_typescript(&schema),
        "{ field_a?: {}; field_n?: {}; }"
    );
}

#[test]
fn root_one_of_keeps_properties_in_actual_tool_declaration() {
    let mut schema = object_schema();
    schema["oneOf"] = json!([
        { "required": ["field_a"] },
        { "required": ["field_n"] }
    ]);
    let definition = ToolDefinition {
        name: "mcp__schema_repro__test_tool".to_string(),
        tool_name: ToolName::plain("mcp__schema_repro__test_tool"),
        description: "Select one declared variant.".to_string(),
        kind: CodeModeToolKind::Function,
        input_schema: Some(schema),
        input_schema_max_bytes: None,
        output_schema: None,
    };
    let declaration = augment_tool_definition(definition).description;
    println!("{declaration}");
    assert!(declaration.contains("field_a"), "first variant name lost");
    assert!(declaration.contains("field_n"), "second variant name lost");
}

#[test]
fn required_only_branch_keeps_its_required_name() {
    let rendered = render_json_schema_to_typescript(&json!({ "required": ["field_a"] }));
    println!("required-only declaration: {rendered}");
    assert!(rendered.contains("field_a:"), "required name lost");
}
