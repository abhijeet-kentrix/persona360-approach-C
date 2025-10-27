from werkzeug.security import generate_password_hash,check_password_hash

if __name__ == '__main__':
    password="monica@kentrix"
    print(generate_password_hash(password))
    # key = "pbkdf2:sha256:260000$c9ULMyTAxYmHsG07$b4cd4b86f97e9fb3aa8d2cd5b21da865a9ca172a5f045c50dfce96c014a1b7c4"
    # print(check_password_hash(key, password))
    # key = "pbkdf2:sha256:260000$oCHdFynePblhhLfX$3ebfb8b5d6ec9a820498bcbd16c498414978a4e0e0d6dd5272cf0a7f759ff324"
    karan_pass= "KentrixDash198@karan"
    karan_key ="pbkdf2:sha256:260000$zw5TTNtz6X9BzuK7$ebba05705f7499b484c7ab1ac343fede353860c831872e800ce1cf6a4dff7499"
    rh_pass = "KentrixDash823@rahoul"
    rh_key="pbkdf2:sha256:260000$9P4TZAqLDUFu3yBn$3878220342b24abc71ccea4adf4f658d34c7320c49c4c4c1573c5b51c00329f5"
    moomin= "KentrixDash982@momin"
    mm_key = "pbkdf2:sha256:260000$YVH1A7LukcrZDeAl$a8f7845c8a310d509e6c6e494e857c64c583a5988ccb13d7a235f3c55d705e48"