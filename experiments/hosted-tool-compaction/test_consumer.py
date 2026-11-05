import unittest
from agent_framework import Content, Message, ToolResultCompactionStrategy, annotate_message_groups, included_messages

class ConsumerTests(unittest.IsolatedAsyncioTestCase):
    async def compact(self, output, *, keep=0, latest=False):
        messages=[Message(role='user',contents=['Run checks']),Message(role='assistant',contents=[Content.from_shell_tool_call(call_id='old',commands=['check'])]),Message(role='tool',contents=[Content.from_shell_tool_result(call_id='old',outputs=output)]),Message(role='assistant',contents=['Check recorded'])]
        if latest:
            messages += [Message(role='user',contents=['Next check']),Message(role='assistant',contents=[Content.from_function_call('new','check')]),Message(role='tool',contents=[Content.from_function_result('new',result='latest-result')]),Message(role='assistant',contents=['Done'])]
        annotate_message_groups(messages)
        await ToolResultCompactionStrategy(keep_last_tool_call_groups=keep)(messages)
        visible=list(included_messages(messages))
        summaries=[m.text for m in visible if m.text and m.text.startswith('[Tool results:')]
        return messages,visible,summaries

    async def test_stdout_stderr_exit_survive(self):
        _,visible,s=await self.compact([Content.from_shell_command_output(stdout='checks: 7 passed',stderr='warning: fixture',exit_code=0)])
        self.assertEqual(len(s),1)
        for fragment in ['checks: 7 passed','warning: fixture','exit_code: 0']:self.assertIn(fragment,s[0])
        self.assertFalse(any(c.type=='shell_tool_result' for m in visible for c in m.contents))

    async def test_nonzero_and_timeout_survive(self):
        _,_,s=await self.compact([Content.from_shell_command_output(stderr='test failed',exit_code=2),Content.from_shell_command_output(timed_out=True)])
        for fragment in ['test failed','exit_code: 2','timed out']:self.assertIn(fragment,s[0])

    async def test_keep_latest_does_not_protect_old_shell(self):
        _,visible,s=await self.compact([Content.from_shell_command_output(stdout='old-required-evidence',exit_code=0)],keep=1,latest=True)
        self.assertIn('old-required-evidence',s[0])
        self.assertTrue(any(c.type=='function_result' and c.result=='latest-result' for m in visible for c in m.contents))

    async def test_retained_only_group_unchanged(self):
        _,visible,s=await self.compact([Content.from_shell_command_output(stdout='retained',exit_code=0)],keep=1)
        self.assertEqual(s,[])
        self.assertTrue(any(c.type=='shell_tool_result' for m in visible for c in m.contents))

    async def test_empty_result_not_claimed_absent(self):
        _,_,s=await self.compact([])
        self.assertIn('no output returned',s[0])
        self.assertNotIn('no results',s[0])

if __name__=='__main__':unittest.main()
