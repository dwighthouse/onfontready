# Testing Old Versions of Internet Explorer

Below are some testing notes for testing various versions of Internet Explorer on OS X. The details may be helpful if testing is desired on other OS's.

Use [IEVMS bash script](https://github.com/xdissent/ievms) for old IE Virtual Machine download and setup. IE6,7,8 will expire after 30 days. Just delete the VMs and re-download. You can specify specific versions like so:

```
curl -s https://raw.githubusercontent.com/xdissent/ievms/master/ievms.sh | env IEVMS_VERSIONS="6 8 9" bash
```

Recently, installing IE7 and IE8 have been very difficult. The install process will get stuck while trying to update the IE install on those VMs. Just "Show" the VM, complete the installation, then shutdown manually.

Since many (most?) server providers no longer support IE6 for security reasons, testing IE6 over a network is very difficult. You will need to run a local server from the test directory, then use Mac's IPv4 address as the domain, rather than 'localhost'. Don't forget the port number. (Original concepts from [here](http://kevin.schaul.io/2014/04/14/tips-for-debugging-in-ie/).)

1. Navigate to project root directory
2. Run the simple Python HTML server: `python -m SimpleHTTPServer`
3. Find the IPv4 address for your network
   A. Open System Preferences
   B. Click Network
   C. Select the currently used network
   D. Click Advanced
   E. Select TCP/IP tab
   F. Note the IPv4 address listed
4. Inside the VM's browser, navigate the address bar to the IPv4 address
   - Use the standard port number provided by SimpleHTTPServer (default 8000)
   - The `http://` is important
   - For example: `http://192.168.0.9:8000/tests/index.html`
5. Navigate to http://192.168.0.9:8000/tests/