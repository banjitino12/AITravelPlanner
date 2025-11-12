import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)

completion = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "你是谁？"},
    ],
    stream=True
)

for chunk in completion:
    # 某些 chunk 有 .choices[0].delta.content，有些可能用不同字段，做稳健处理
    delta = chunk.choices[0].delta
    if isinstance(delta, dict):
        print(delta.get("content", ""), end="", flush=True)
    else:
        # 备用兼容：直接打印字符串
        print(getattr(chunk.choices[0], "delta", ""), end="", flush=True)
print()  # 换行