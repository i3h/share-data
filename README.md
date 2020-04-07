# share-data

This GitHub Action shares data between Jobs with help of artifact.

```
- name: Set data
  id: set_data
  uses: noobly314/share-data@v1
  with:
    share-id: 'testing'
    mode: set
    key: username
    value: myname
```
