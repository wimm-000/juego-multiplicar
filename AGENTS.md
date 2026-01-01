# Agents Documentation

This file documents the available agents and their capabilities for future reference.

## Available Agents

### 1. General Agent (`general`)
- **Purpose**: General-purpose agent for researching complex questions and executing multi-step tasks
- **Capabilities**: 
  - Execute multiple units of work in parallel
  - Handle complex research tasks
  - Manage multi-step workflows
- **Usage**: Use for complex tasks that require multiple operations or extensive research

### 2. Explore Agent (`explore`)
- **Purpose**: Fast agent specialized for exploring codebases
- **Capabilities**:
  - Quick file pattern matching (e.g., "src/components/**/*.tsx")
  - Fast code keyword searches
  - Answer questions about codebase structure and functionality
- **Thoroughness Levels**:
  - `quick`: Basic searches and quick exploration
  - `medium`: Moderate exploration with more depth
  - `very thorough`: Comprehensive analysis across multiple locations and naming conventions
- **Usage**: Use when you need to quickly find files, search code patterns, or understand how the codebase works

## When to Use Each Agent

### Use General Agent when:
- Executing custom slash commands
- Handling complex multi-step tasks
- Research requires extensive analysis
- Task involves multiple parallel operations

### Use Explore Agent when:
- Searching for specific file patterns
- Looking for code keywords or patterns
- Understanding codebase structure
- Answering "how does X work?" questions
- Need to quickly navigate the codebase

## Usage Examples

### General Agent Example
```
Task(description="Complex research task", prompt="/custom-command with args", subagent_type="general")
```

### Explore Agent Example
```
Task(description="Find React components", prompt="Find all React components in the codebase", subagent_type="explore")
```

## Agent Selection Guidelines

1. **Start with Explore Agent** for code-related questions - it's faster and more specialized
2. **Use General Agent** for complex workflows or when Explore Agent isn't sufficient
3. **Consider thoroughness level** when using Explore Agent:
   - `quick` for simple searches
   - `medium` for moderate exploration
   - `very thorough` for comprehensive analysis

## Agent Limitations

- Agents are stateless unless a session_id is provided
- Each agent invocation returns a single message
- Agents cannot directly modify files (they provide analysis and guidance)
- Agents have access to different tool sets optimized for their purpose

## Best Practices

1. Be specific in your prompts about what information you need
2. Use the appropriate thoroughness level for Explore Agent
3. Provide clear task descriptions
4. Use session_id for continuing complex conversations
5. Prefer Explore Agent for code-related tasks for better performance