EXTERNAL has_item()
EXTERNAL is_done()
EXTERNAL is_accepted()
EXTERNAL accept()
EXTERNAL deliver()
-> npc

=== npc ===
{ is_done(): -> completed }
{ not is_accepted(): -> introduce }
{ has_item(): -> deliver_offer }
-> missing

=== introduce ===
Archivist: Bring me the brass seal. I can open the archive.
+ [Accept]
  ~ accept()
  -> npc
+ [Leave]
  -> END

=== deliver_offer ===
Archivist: You have the seal. Hand it over?
+ [Deliver]
  ~ temp success = deliver()
  {success: Archivist: The archive is open.|Archivist: You no longer have the seal.}
  -> END
+ [Leave]
  -> END

=== missing ===
Archivist: The seal must be in your bag, not in storage.
-> END

=== completed ===
Archivist: The archive is open. Thank you.
-> END
