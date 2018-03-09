package utils

import java.net.URLEncoder
import java.security.MessageDigest
import java.util
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

import org.apache.commons.codec.binary.Base64
import org.mindrot.jbcrypt.BCrypt


/**
  * procucayt
  * Created by jeronimocarlos on 4/7/17.
  */
object ScalaEncrypter {

  val key: String = "onz&34nASDjnat*Jp(hypq*0!"

  def encrypt(msg: String) : String =  {
    BCrypt.hashpw(msg, BCrypt.gensalt)
  }

  def checkEncrypted(msg: String, encrypted: String) : Boolean =  {
    BCrypt.checkpw(msg, encrypted)
  }

  def stringEncrypt(key: String, value: String): String = {
    val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
    cipher.init(Cipher.ENCRYPT_MODE, keyToSpec(key))
    val result = Base64.encodeBase64String(cipher.doFinal(value.getBytes("UTF-8")))
    URLEncoder.encode(result, "UTF-8")
  }

  def decrypt(key: String, encryptedValue: String): String = {
    val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING")
    cipher.init(Cipher.DECRYPT_MODE, keyToSpec(key))
    new String(cipher.doFinal(Base64.decodeBase64(encryptedValue)))
  }

  private def keyToSpec(key: String): SecretKeySpec = {
    var keyBytes: Array[Byte] = (SALT + key).getBytes("UTF-8")
    val sha: MessageDigest = MessageDigest.getInstance("SHA-1")
    keyBytes = sha.digest(keyBytes)
    keyBytes = util.Arrays.copyOf(keyBytes, 16)
    new SecretKeySpec(keyBytes, "AES")
  }

  private val SALT: String =
    "jMhKlOuJnM34G6NHkqo9V010GhLAqOpF0BePojHgh1HgNg8^72k"

}
